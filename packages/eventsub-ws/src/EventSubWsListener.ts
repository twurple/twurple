import { type Connection, PersistentConnection, WebSocketConnection } from '@d-fischer/connection';
import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixEventSubWebSocketTransportOptions, HellFreezesOverError } from '@twurple/api';
import { rtfm } from '@twurple/common';
import {
	EventSubBase,
	type EventSubBaseConfig,
	type EventSubListener,
	type EventSubNotificationPayload
} from '@twurple/eventsub-base';
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
	@Enumerable(false) private readonly _connection: PersistentConnection<Connection>;
	@Enumerable(false) private _sessionId?: string;
	private readonly _initialUrl: string;

	private _reconnectInProgress: boolean = false;
	private _reconnectUrl?: string;
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
		super(config);

		this._initialUrl = config.url ?? 'wss://eventsub-beta.wss.twitch.tv/ws';
		this._keepaliveTimeout = null;
		this._keepaliveTimer = null;

		this._connection = new PersistentConnection(
			WebSocketConnection,
			() => ({
				url: this._reconnectUrl ?? this._initialUrl
			}),
			{
				overlapManualReconnect: true
			}
		);

		this._connection.onDisconnect(() => {
			this._readyToSubscribe = false;
			this._clearKeepaliveTimer();
			this._keepaliveTimeout = null;
		});
		this._connection.onReceive(data => {
			this._logger.debug(`Received data: ${data.trim()}`);
			const { metadata, payload } = JSON.parse(data) as EventSubWsPacket;
			switch (metadata.message_type) {
				case 'session_welcome': {
					this._logger.info(
						this._reconnectInProgress ? 'Reconnect: new connection established' : 'Connection established'
					);
					this._sessionId = (payload as EventSubWelcomePayload).session.id;
					this._readyToSubscribe = true;
					if (!this._reconnectInProgress) {
						for (const sub of this._subscriptions.values()) {
							sub.start();
						}
					}
					this._initializeKeepaliveTimeout(
						(payload as EventSubWelcomePayload).session.keepalive_timeout_seconds!
					);
					this._reconnectInProgress = false;
					this._connection.acknowledgeSuccessfulReconnect();
					break;
				}
				case 'session_keepalive': {
					this._restartKeepaliveTimer();
					break;
				}
				case 'session_reconnect': {
					this._logger.info('Reconnect message received; initiating new connection');
					this._reconnectInProgress = true;
					this._reconnectUrl = (payload as EventSubReconnectPayload).session.reconnect_url!;
					this._connection.reconnect();
					break;
				}
				case 'notification': {
					this._restartKeepaliveTimer();
					const id = (payload as EventSubNotificationPayload).subscription.id;
					const subscription = this._getCorrectSubscriptionByTwitchId(id);
					if (!subscription) {
						this._logger.error(`Notification from unknown event received: ${id}`);
						break;
					}
					const notificationPayload = payload as EventSubNotificationPayload;
					if ('events' in notificationPayload) {
						for (const event of notificationPayload.events) {
							subscription._handleData(event.data);
						}
					} else {
						subscription._handleData(notificationPayload.event);
					}
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
	}

	/**
	 * Starts the WebSocket listener.
	 */
	start(): void {
		this._connection.connect();
	}

	/**
	 * Stops the WebSocket listener.
	 */
	stop(): void {
		this._connection.disconnect();
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
			// 1200 instead of 1000 to allow for a little more leeway than Twitch wants to give us
			this._keepaliveTimer = setTimeout(() => this._handleKeepaliveTimeout(), this._keepaliveTimeout * 1200);
		}
	}

	private _handleKeepaliveTimeout() {
		this._keepaliveTimer = null;
		this._connection.assumeExternalDisconnect();
	}
}
