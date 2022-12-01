import { WebSocketConnection } from '@d-fischer/connection';
import { delay, Enumerable, fibWithLimit } from '@d-fischer/shared-utils';
import type { HelixEventSubWebSocketTransportOptions } from '@twurple/api';
import { HellFreezesOverError } from '@twurple/api';
import { InvalidTokenTypeError } from '@twurple/auth';
import { rtfm } from '@twurple/common';
import type { EventSubBaseConfig, EventSubListener, EventSubNotificationPayload } from '@twurple/eventsub-base';
import { EventSubBase } from '@twurple/eventsub-base';
import {
	type EventSubReconnectPayload,
	type EventSubWelcomePayload,
	type EventSubWsPacket
} from './EventSubWsPacket.external';

/**
 * Configuration for an EventSub WebSocket listener.
 */
export interface EventSubWsConfig extends EventSubBaseConfig {
	/**
	 * The URL to connect to initially.
	 *
	 * Can be used to connect to a test server, for example one created by the Twitch CLI.
	 */
	url?: string;
}

/**
 * A WebSocket listener for the Twitch EventSub event distribution mechanism.
 *
 * @beta
 * @hideProtected
 * @inheritDoc
 *
 * @meta category main
 */
@rtfm('eventsub-ws', 'EventSubWsListener')
export class EventSubWsListener extends EventSubBase implements EventSubListener {
	@Enumerable(false) private _connection?: WebSocketConnection;
	@Enumerable(false) private _sessionId?: string;
	@Enumerable(false) private _welcomeCallback?: () => void | Promise<void>;
	private readonly _initialUrl: string;

	private _connecting: boolean;
	private _reconnectInProgress: boolean;
	private _keepaliveTimeout: number | null;
	private _keepaliveTimer: NodeJS.Timer | null;

	/**
	 * Creates a new EventSub HTTP listener.
	 *
	 * @param config
	 *
	 * @expandParams
	 */
	constructor(config: EventSubWsConfig) {
		if (config.apiClient._authProvider.tokenType !== 'user') {
			throw new InvalidTokenTypeError('EventSub over WebSockets requires user access tokens to work.');
		}

		super(config);

		this._initialUrl = config.url ?? 'wss://eventsub-beta.wss.twitch.tv/ws';
		this._connecting = false;
		this._reconnectInProgress = false;
		this._keepaliveTimeout = null;
		this._keepaliveTimer = null;
	}

	/**
	 * Starts the WebSocket listener.
	 */
	async start(): Promise<void> {
		const welcomePromise = new Promise<void>(resolve => (this._welcomeCallback = resolve));
		await this._connect();
		await welcomePromise;
	}

	/**
	 * Stops the WebSocket listener.
	 */
	async stop(): Promise<void> {
		if (this._connection) {
			await Promise.all([...this._subscriptions.values()].map(async sub => await sub.suspend()));
			await this._connection.disconnect();
		}
	}

	/** @private */
	async _getCliTestCommandForSubscription(): Promise<string> {
		throw new Error("Testing WebSocket subscriptions currently isn't supported by the CLI");
	}

	/** @private */
	async _getTransportOptionsForSubscription(): Promise<HelixEventSubWebSocketTransportOptions> {
		if (!this._sessionId) {
			throw new HellFreezesOverError('Listener is not connected or does not have a session ID yet');
		}
		return {
			method: 'websocket',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			session_id: this._sessionId
		};
	}

	protected _findTwitchSubscriptionToContinue(): undefined {
		return undefined;
	}

	private async _connect(): Promise<void> {
		await this._connectTo(this._initialUrl);
	}

	private async _connectTo(url: string): Promise<void> {
		if (this._connection) {
			this._welcomeCallback = undefined;
			throw new Error('Trying to connect while already connected');
		}

		this._connecting = true;
		const retryTimerGenerator = fibWithLimit(120);

		while (true) {
			const newConnection = (this._connection = new WebSocketConnection({ url }, { logger: this._logger }));
			newConnection.onDisconnect(async (manually, reason?: Error) => {
				this._readyToSubscribe = false;
				this._clearKeepaliveTimer();
				this._keepaliveTimeout = null;
				if (manually) {
					if (this._reconnectInProgress) {
						this._logger.debug('Reconnect: old connection cleaned up');
					} else {
						this._logger.info('Disconnected');
					}
					void newConnection.disconnect();
					if (this._connection === newConnection) {
						this._connection = undefined;
					}
				} else {
					if (reason) {
						this._logger.warn(`Disconnected unexpectedly: ${reason.message}; trying to reconnect`);
					} else {
						this._logger.warn('Disconnected unexpectedly; trying to reconnect');
					}

					if (!this._connecting) {
						void this._reconnect();
					}
				}
			});
			this._connection.onReceive(async data => {
				this._logger.debug(`Received data: ${data.trim()}`);
				const { metadata, payload } = JSON.parse(data) as EventSubWsPacket;
				switch (metadata.message_type) {
					case 'session_welcome': {
						this._logger.info(
							this._reconnectInProgress
								? 'Reconnect: new connection established'
								: 'Connection established'
						);
						this._sessionId = (payload as EventSubWelcomePayload).session.id;
						this._readyToSubscribe = true;
						const welcomeCallbackPromise = this._welcomeCallback?.();
						this._welcomeCallback = undefined;
						await welcomeCallbackPromise;
						if (!this._reconnectInProgress) {
							await Promise.all([...this._subscriptions.values()].map(async sub => await sub.start()));
						}
						this._initializeKeepaliveTimeout(
							(payload as EventSubWelcomePayload).session.keepalive_timeout_seconds!
						);
						this._reconnectInProgress = false;
						break;
					}
					case 'session_keepalive': {
						this._restartKeepaliveTimer();
						break;
					}
					case 'session_reconnect': {
						this._logger.info('Reconnect message received; initiating new connection');
						this._reconnectInProgress = true;
						const oldConnection = this._connection!;
						this._connection = undefined;
						this._welcomeCallback = async () => await oldConnection.disconnect();
						await this._connectTo((payload as EventSubReconnectPayload).session.reconnect_url!);
						break;
					}
					case 'notification': {
						const id = (payload as EventSubNotificationPayload).subscription.id;
						const subscription = this._getCorrectSubscriptionByTwitchId(id);
						if (!subscription) {
							this._logger.error(`Notification from unknown event received: ${id}`);
							break;
						}
						subscription._handleData((payload as EventSubNotificationPayload).event);
						break;
					}
					case 'revocation': {
						const id = (payload as EventSubNotificationPayload).subscription.id;
						const subscription = this._getCorrectSubscriptionByTwitchId(id);
						if (!subscription) {
							this._logger.error(`Revocation from unknown event received: ${id}`);
							break;
						}
						this._dropSubscription(subscription.id);
						this._dropTwitchSubscription(subscription.id);
						this.emit(this.onRevoke, subscription);
						this._logger.debug(`Subscription revoked by Twitch for event: ${id}`);
						break;
					}
					default: {
						this._logger.warn(`Unknown message type encountered: ${metadata.message_type}`);
					}
				}
			});
			try {
				await this._connection.connect();
				this._connecting = false;
				return;
			} catch (e) {
				if (!this._connecting) {
					return;
				}
				this._logger.debug(`Connection error caught: ${(e as Error).message}`);
				const secs = retryTimerGenerator.next().value;

				if (secs !== 0) {
					this._logger.info(`Retrying in ${secs} seconds`);
				}

				await delay(secs * 1000);

				this._logger.info('Trying to reconnect');

				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if (!this._connecting) {
					return;
				}
			}
		}
	}

	private async _disconnect() {
		this._connecting = false;
		if (this._connection) {
			const lastConnection = this._connection;
			this._connection = undefined;
			await lastConnection.disconnect();
		}
	}

	private async _reconnect(): Promise<void> {
		void this._disconnect().catch((e: Error) =>
			this._logger.error(`Error while disconnecting for the reconnect: ${e.message}`)
		);
		await this._connect();
	}

	private _initializeKeepaliveTimeout(timeoutInSeconds: number): void {
		this._keepaliveTimeout = timeoutInSeconds;
		this._restartKeepaliveTimer();
	}

	private _clearKeepaliveTimer(): void {
		if (this._keepaliveTimer) {
			clearTimeout(this._keepaliveTimer);
			this._keepaliveTimer = null;
		}
	}

	private _restartKeepaliveTimer(): void {
		this._clearKeepaliveTimer();
		if (this._keepaliveTimeout) {
			this._keepaliveTimer = setTimeout(() => this._handleKeepaliveTimeout(), this._keepaliveTimeout);
		}
	}

	private _handleKeepaliveTimeout() {
		this._keepaliveTimer = null;
		this._connection?.assumeExternalDisconnect();
	}
}
