import { type Connection, PersistentConnection, WebSocketConnection } from '@d-fischer/connection';
import { createLogger, type Logger, type LoggerOptions } from '@d-fischer/logger';
import { Enumerable } from '@d-fischer/shared-utils';
import {
	type EventSubNotificationPayload,
	type EventSubRevocationPayload,
	type EventSubSubscription,
} from '@twurple/eventsub-base';
import { type EventSubWsListener } from './EventSubWsListener';
import {
	type EventSubReconnectPayload,
	type EventSubWelcomePayload,
	type EventSubWsPacket,
} from './EventSubWsPacket.external';

/** @internal */
export class EventSubWsSocket {
	@Enumerable(false) private readonly _connection: PersistentConnection<Connection>;
	@Enumerable(false) private _sessionId?: string;
	private readonly _initialUrl: string;

	private _reconnectInProgress: boolean = false;
	private _reconnectUrl?: string;
	private _keepaliveTimeout: number | null;
	private _keepaliveTimer: NodeJS.Timer | null;

	private readonly _logger: Logger;
	private _readyToSubscribe = false;

	constructor(
		private readonly _listener: EventSubWsListener,
		private readonly _userId: string,
		initialUrl: string,
		loggerOptions?: Partial<LoggerOptions>,
	) {
		this._logger = createLogger({
			name: `twurple:eventsub:ws:${_userId}`,
			...loggerOptions,
		});
		this._initialUrl = initialUrl;
		this._keepaliveTimeout = null;
		this._keepaliveTimer = null;

		this._connection = new PersistentConnection(
			WebSocketConnection,
			() => ({
				url: this._reconnectUrl ?? this._initialUrl,
			}),
			{
				overlapManualReconnect: true,
			},
		);

		this._connection.onConnect(() => {
			if (!this._reconnectInProgress) {
				this._listener._notifySocketConnect(this);
			}
		});
		this._connection.onDisconnect((_, e) => {
			if (this._reconnectInProgress) {
				this._reconnectInProgress = false;
			} else {
				this._listener._notifySocketDisconnect(this, e);
				this._readyToSubscribe = false;
				this._clearKeepaliveTimer();
				this._keepaliveTimeout = null;
				for (const sub of this._listener._getSubscriptionsForUser(this._userId)) {
					sub._droppedByTwitch();
				}
			}
		});
		this._connection.onReceive(data => {
			this._logger.debug(`Received data: ${data.trim()}`);
			const { metadata, payload } = JSON.parse(data) as EventSubWsPacket;
			switch (metadata.message_type) {
				case 'session_welcome': {
					this._logger.info(
						this._reconnectInProgress ? 'Reconnect: new connection established' : 'Connection established',
					);
					this._sessionId = (payload as EventSubWelcomePayload).session.id;
					this._readyToSubscribe = true;
					if (!this._reconnectInProgress) {
						const subs = this._listener._getSubscriptionsForUser(this._userId);
						if (!subs.length) {
							this._logger.debug(
								`Stopping socket for user ${this._userId} because no subscriptions are active`,
							);
							this.stop();
							break;
						}
						for (const sub of subs) {
							sub.start();
						}
					}
					this._initializeKeepaliveTimeout(
						(payload as EventSubWelcomePayload).session.keepalive_timeout_seconds!,
					);
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
					const { id } = (payload as EventSubNotificationPayload).subscription;
					const subscription = this._listener._getCorrectSubscriptionByTwitchId(id);
					if (!subscription) {
						this._logger.error(`Notification from unknown event received: ${id}`);
						break;
					}
					const notificationPayload = payload as EventSubNotificationPayload;
					if ('events' in notificationPayload) {
						for (const event of notificationPayload.events) {
							this._handleSingleEventPayload(subscription, event.data);
						}
					} else {
						this._handleSingleEventPayload(subscription, notificationPayload.event);
					}
					break;
				}
				case 'revocation': {
					const { id, status } = (payload as EventSubRevocationPayload).subscription;
					const subscription = this._listener._getCorrectSubscriptionByTwitchId(id);
					if (!subscription) {
						this._logger.error(`Revocation from unknown event received: ${id}`);
						break;
					}
					this._listener._dropSubscription(subscription.id);
					this._listener._dropTwitchSubscription(subscription.id);
					this._listener._handleSubscriptionRevoke(subscription, status);
					this._logger.debug(`Subscription revoked by Twitch for event: ${id}`);
					break;
				}
				default: {
					this._logger.warn(`Unknown message type encountered: ${metadata.message_type}`);
				}
			}
		});
	}

	start(): void {
		if (!this._connection.isConnected && !this._connection.isConnecting) {
			this._connection.connect();
		}
	}

	stop(): void {
		if (this._connection.isConnected || this._connection.isConnecting) {
			this._connection.disconnect();
		}
	}

	get readyToSubscribe(): boolean {
		return this._readyToSubscribe;
	}

	get sessionId(): string | undefined {
		return this._sessionId;
	}

	get userId(): string {
		return this._userId;
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

	/** @internal */
	private _handleSingleEventPayload(subscription: EventSubSubscription, payload: Record<string, unknown>) {
		subscription._handleData(payload).catch(e => {
			this._logger.error(
				`Caught an unhandled error in EventSub event handler for subscription ${subscription.id}.
You should probably add try-catch to your handler to be able to examine it further.

Message: ${(e as Error | undefined)?.message ?? e}`,
			);
		});
	}
}
