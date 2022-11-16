import { WebSocketConnection } from '@d-fischer/connection';
import { Enumerable } from '@d-fischer/shared-utils';
import type { HelixEventSubWebSocketTransportOptions } from '@twurple/api';
import { InvalidTokenTypeError } from '@twurple/auth';
import { rtfm } from '@twurple/common';
import type { EventSubBaseConfig, EventSubListener, EventSubNotificationPayload } from '@twurple/eventsub-base';
import { EventSubBase } from '@twurple/eventsub-base';

/** @private */
interface EventSubWsMetadata {
	message_id: string;
	message_type: string;
	message_timestamp: string;
	subscription_type: string;
	subscription_version: string;
}

/** @private */
interface EventSubWsSession {
	id: string;
	status: string; // TODO
	keepalive_timeout_seconds: number | null;
	reconnect_url: string | null;
	connected_at: string;
}

/** @private */
interface EventSubReconnectPayload {
	session: EventSubWsSession;
}

/** @private */
interface EventSubWelcomePayload {
	session: EventSubWsSession;
}

/** @private */
type EventSubWsPayload = EventSubNotificationPayload | EventSubReconnectPayload | EventSubWelcomePayload;

/** @private */
interface EventSubWsPacket {
	metadata: EventSubWsMetadata;
	payload: EventSubWsPayload;
}

/**
 * A WebSocket listener for the Twitch EventSub event distribution mechanism.
 *
 * @hideProtected
 * @inheritDoc
 *
 * @meta category main
 */
@rtfm('eventsub-ws', 'EventSubWsListener')
export class EventSubWsListener extends EventSubBase implements EventSubListener {
	@Enumerable(false) private _connection?: WebSocketConnection;
	@Enumerable(false) private _sessionId?: string;
	@Enumerable(false) private _welcomeCallback?: () => void;

	/**
	 * Creates a new EventSub HTTP listener.
	 *
	 * @param config
	 *
	 * @expandParams
	 */
	constructor(config: EventSubBaseConfig) {
		if (config.apiClient._authProvider.tokenType !== 'user') {
			throw new InvalidTokenTypeError('EventSub over WebSockets requires user access tokens to work.');
		}

		super(config);
	}

	async start(): Promise<void> {
		const welcomePromise = new Promise<void>(resolve => (this._welcomeCallback = resolve));
		await this._connect();
		await welcomePromise;
	}

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
			throw new Error(
				'Listener is not connected or does not have a session ID yet (this is a bug, please report it)'
			);
		}
		return {
			method: 'websocket',
			session_id: this._sessionId
		};
	}

	private async _connect(): Promise<void> {
		await this._connectTo('wss://eventsub-beta.wss.twitch.tv/ws');
	}

	private async _connectTo(url: string): Promise<void> {
		if (this._connection) {
			this._welcomeCallback = undefined;
			throw new Error('Trying to connect while already connected');
		}
		this._connection = new WebSocketConnection({ url });
		this._connection.onConnect(() => {
			// TODO reset backoff
		});
		this._connection.onDisconnect(async manually => {
			this._readyToSubscribe = false;
			this._connection = undefined;
			if (!manually) {
				await this._connect(); // TODO backoff failures, re-register subscriptions on successful reconnect (at welcome?)
			}
		});
		this._connection.onReceive(async data => {
			const { metadata, payload } = JSON.parse(data) as EventSubWsPacket;
			switch (metadata.message_type) {
				case 'session_welcome': {
					this._sessionId = (payload as EventSubWelcomePayload).session.id;
					this._readyToSubscribe = true;
					this._welcomeCallback?.();
					this._welcomeCallback = undefined;
					// TODO subscribe to all resting subscription objects
					break;
				}
				case 'session_keepalive': {
					// TODO reset keepalive timeout
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
				case 'reconnect': {
					await this._connection?.disconnect();
					await this._connectTo((payload as EventSubReconnectPayload).session.reconnect_url!);
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
		await this._connection.connect();
	}
}
