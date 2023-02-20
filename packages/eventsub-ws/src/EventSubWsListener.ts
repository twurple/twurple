import { type LoggerOptions } from '@d-fischer/logger';
import { type HelixEventSubWebSocketTransportOptions, HellFreezesOverError } from '@twurple/api';
import { rtfm } from '@twurple/common';
import {
	EventSubBase,
	type EventSubBaseConfig,
	type EventSubListener,
	type EventSubSubscription
} from '@twurple/eventsub-base';
import { EventSubWsSocket } from './EventSubWsSocket';

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
	private readonly _sockets = new Map<string, EventSubWsSocket>();
	private readonly _initialUrl: string;
	private _accepting = false;
	private readonly _loggerOptions?: Partial<LoggerOptions>;

	/**
	 * Fires when a user socket has established a connection with the EventSub server.
	 *
	 * @param userId The ID of the user.
	 */
	readonly onUserSocketConnect = this.registerEvent<[userId: string]>();

	/**
	 * Fires when a user socket has disconnected from the EventSub server.
	 *
	 * @param userId The ID of the user.
	 * @param error The error that caused the disconnection, or `undefined` for a clean disconnect.
	 */
	readonly onUserSocketDisconnect = this.registerEvent<[userId: string, error?: Error]>();

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
		this._loggerOptions = config.logger;
	}

	/**
	 * Starts the WebSocket listener.
	 */
	start(): void {
		this._accepting = true;
		const userSocketsToCreate = new Set<string>([...this._subscriptions.values()].map(sub => sub.authUserId!));
		for (const userId of userSocketsToCreate) {
			this._createSocketForUser(userId);
		}
	}

	/**
	 * Stops the WebSocket listener.
	 */
	stop(): void {
		this._accepting = false;
		for (const socket of this._sockets.values()) {
			socket.stop();
		}
		this._sockets.clear();
	}

	/** @private */
	async _getCliTestCommandForSubscription(): Promise<string> {
		throw new Error("Testing WebSocket subscriptions currently isn't supported by the CLI");
	}

	/** @private */
	_isReadyToSubscribe(subscription: EventSubSubscription): boolean {
		const authUserId = subscription.authUserId;
		if (!authUserId) {
			throw new Error('Can not create a WebSocket subscription for a topic without user authentication');
		}
		const socket = this._sockets.get(authUserId);

		return socket?.readyToSubscribe ?? false;
	}

	/** @private */
	async _getTransportOptionsForSubscription(
		subscription: EventSubSubscription
	): Promise<HelixEventSubWebSocketTransportOptions> {
		const authUserId = subscription.authUserId;
		if (!authUserId) {
			throw new Error('Can not create a WebSocket subscription for a topic without user authentication');
		}
		const socket = this._sockets.get(authUserId);
		if (!socket?.sessionId) {
			throw new HellFreezesOverError(
				`Socket for user ${authUserId} is not connected or does not have a session ID yet`
			);
		}
		return {
			method: 'websocket',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			session_id: socket.sessionId
		};
	}

	/** @private */
	_getSubscriptionsForUser(userId: string): EventSubSubscription[] {
		return [...this._subscriptions.values()].filter(sub => sub.authUserId === userId);
	}

	/** @private */
	_handleSubscriptionRevoke(subscription: EventSubSubscription): void {
		this.emit(this.onRevoke, subscription);
	}

	/** @private */
	_notifySocketConnect(socket: EventSubWsSocket): void {
		this.emit(this.onUserSocketConnect, socket.userId);
	}

	/** @private */
	_notifySocketDisconnect(socket: EventSubWsSocket, error?: Error): void {
		this.emit(this.onUserSocketDisconnect, socket.userId, error);
	}

	protected _genericSubscribe<T, Args extends unknown[]>(
		clazz: new (handler: (obj: T) => void, client: EventSubBase, ...args: Args) => EventSubSubscription<T>,
		handler: (obj: T) => void,
		client: EventSubBase,
		...params: Args
	): EventSubSubscription {
		const subscription = super._genericSubscribe(clazz, handler, client, ...params);
		const authUserId = subscription.authUserId;
		if (!authUserId) {
			throw new HellFreezesOverError('WS subscription created without user ID');
		}
		if (!this._accepting) {
			return subscription;
		}
		if (!this._sockets.has(authUserId)) {
			this._createSocketForUser(authUserId);
		}

		return subscription;
	}

	protected _findTwitchSubscriptionToContinue(): undefined {
		return undefined;
	}

	private _createSocketForUser(authUserId: string) {
		const socket = new EventSubWsSocket(this, authUserId, this._initialUrl, this._loggerOptions);
		this._sockets.set(authUserId, socket);
		socket.start();
	}
}
