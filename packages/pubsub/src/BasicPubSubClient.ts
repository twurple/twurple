import type { Connection, WebSocketClientOptions } from '@d-fischer/connection';
import { PersistentConnection, WebSocketConnection } from '@d-fischer/connection';
import type { Logger, LoggerOptions } from '@d-fischer/logger';
import { createLogger } from '@d-fischer/logger';
import type { ResolvableValue } from '@d-fischer/shared-utils';
import { Enumerable } from '@d-fischer/shared-utils';
import { EventEmitter } from '@d-fischer/typed-event-emitter';
import type { AuthProvider } from '@twurple/auth';
import { getValidTokenFromProviderForUser } from '@twurple/auth';
import { HellFreezesOverError, rtfm } from '@twurple/common';
import type { PubSubMessageData } from './messages/PubSubMessage';
import type { PubSubIncomingPacket, PubSubNoncedOutgoingPacket, PubSubOutgoingPacket } from './PubSubPacket.external';
import { createListenPacket } from './PubSubPacket.external';

/** @private */
interface StaticTokenResolvable {
	type: 'static';
	token: string;
}

/** @private */
interface FunctionTokenResolvable {
	type: 'function';
	function: () => string | Promise<string>;
}

/** @private */
interface ProviderTokenResolvable {
	type: 'provider';
	provider: AuthProvider;
	scopes: string[];
	userId: string;
}

/** @private */
type TokenResolvable = StaticTokenResolvable | FunctionTokenResolvable | ProviderTokenResolvable;

/**
 * Options for the basic PubSub client.
 */
export interface BasicPubSubClientOptions {
	/**
	 * Options to pass to the logger.
	 */
	logger?: Partial<LoggerOptions>;

	/**
	 * The client options to use for connecting to the WebSocket.
	 */
	wsOptions?: WebSocketClientOptions;
}

/**
 * A client for the Twitch PubSub interface.
 */
@rtfm('pubsub', 'BasicPubSubClient')
export class BasicPubSubClient extends EventEmitter {
	@Enumerable(false) private readonly _logger: Logger;

	// topic => token
	@Enumerable(false) private readonly _topics = new Map<string, TokenResolvable>();

	private readonly _connection: Connection;

	private readonly _pingOnActivity: number = 240;
	private readonly _pingOnInactivity: number = 60;
	private readonly _pingTimeout: number = 10;
	private _activityPingCheckTimer?: NodeJS.Timer;
	private _inactivityPingCheckTimer?: NodeJS.Timer;
	private _pingTimeoutTimer?: NodeJS.Timer;

	private readonly _onPong = this.registerInternalEvent<[]>();
	private readonly _onResponse = this.registerInternalEvent<[nonce: string, error: string]>();

	/**
	 * Fires when a message that matches your listening topics is received.
	 *
	 * @eventListener
	 *
	 * @param topic The name of the topic.
	 * @param message The message data.
	 */
	readonly onMessage = this.registerEvent<[topic: string, message: PubSubMessageData]>();

	/**
	 * Fires when listening to a topic fails.
	 *
	 * @eventListener
	 *
	 * @param topic The name of the topic.
	 * @param error The error.
	 * @param userInitiated Whether the listen was directly initiated by a user.
	 *
	 * The other case would happen in cases like re-sending listen packets after a reconnect.
	 */
	readonly onListenError = this.registerEvent<[topic: string, error: Error, userInitiated: boolean]>();

	/**
	 * Fires when the client finishes establishing a connection to the PubSub server.
	 *
	 * @eventListener
	 */
	readonly onConnect = this.registerEvent<[]>();

	/**
	 * Fires when the client closes its connection to the PubSub server.
	 *
	 * @eventListener
	 * @param isError Whether the cause of the disconnection was an error. A reconnect will be attempted if this is true.
	 * @param reason The error object.
	 */
	readonly onDisconnect = this.registerEvent<[isError: boolean, reason?: Error]>();

	/**
	 * Fires when the client receives a pong message from the PubSub server.
	 *
	 * @eventListener
	 * @param latency The current latency to the server, in milliseconds.
	 * @param requestTimestampe The time the ping request was sent to the PubSub server.
	 */
	readonly onPong = this.registerEvent<[latency: number, requestTimestamp: number]>();

	/**
	 * Creates a new PubSub client.
	 *
	 * @param options
	 *
	 * @expandParams
	 */
	constructor(options?: BasicPubSubClientOptions) {
		super();
		this._logger = createLogger({
			name: 'twurple:pubsub',
			emoji: true,
			...options?.logger
		});

		this._connection = new PersistentConnection(
			WebSocketConnection,
			{ hostName: 'pubsub-edge.twitch.tv', port: 443, secure: true },
			{ logger: this._logger, additionalOptions: { wsOptions: options?.wsOptions } }
		);

		this._connection.onConnect(async () => {
			this._logger.info('Connection established');
			this._pingCheck();
			this._startActivityPingCheckTimer();
			this._startInactivityPingCheckTimer();
			this._resendListens();
			if (this._topics.size) {
				this._logger.info('Listened to previously registered topics');
				this._logger.debug(`Previously registered topics: ${Array.from(this._topics.keys()).join(', ')}`);
			}
			this.emit(this.onConnect);
		});

		this._connection.onReceive((line: string) => {
			this._receiveMessage(line.trim());
			this._startInactivityPingCheckTimer();
		});

		this._connection.onDisconnect((manually: boolean, reason?: Error) => {
			clearInterval(this._activityPingCheckTimer);
			clearInterval(this._inactivityPingCheckTimer);
			clearTimeout(this._pingTimeoutTimer);
			this.removeInternalListener();
			if (manually) {
				this._logger.info('Disconnected');
			} else {
				if (reason) {
					this._logger.error(`Disconnected unexpectedly: ${reason.message}`);
				} else {
					this._logger.error('Disconnected unexpectedly');
				}
			}
			this.emit(this.onDisconnect, manually, reason);
		});
	}

	/**
	 * Listens to one or more topics.
	 *
	 * @param topics A topic or a list of topics to listen to.
	 * @param tokenResolvable An access token, an AuthProvider or a function that returns a token.
	 */
	listen(topics: string | string[], tokenResolvable: ResolvableValue<string> | TokenResolvable): void {
		const topicsArray = typeof topics === 'string' ? [topics] : topics;

		const wrapped = BasicPubSubClient._wrapResolvable(tokenResolvable);
		for (const topic of topicsArray) {
			this._topics.set(topic, wrapped);
		}

		if (this.isConnected) {
			this._resolveToken(wrapped)
				.then(async token => await this._sendListen(topicsArray, token))
				.catch(e => {
					for (const topic of topicsArray) {
						this.emit(this.onListenError, topic, e, true);
					}
				});
		}
	}

	/**
	 * Removes one or more topics from the listener.
	 *
	 * @param topics A topic or a list of topics to not listen to anymore.
	 */
	unlisten(topics: string | string[]): void {
		const topicsArray = typeof topics === 'string' ? [topics] : topics;

		for (const topic of topics) {
			this._topics.delete(topic);
		}

		if (this.isConnected) {
			this._sendUnlisten(topicsArray).catch(e => {
				this._logger.error(
					`Error during unlisten of topics ${topicsArray.join(', ')}: ${
						(e as Error | undefined)?.message ?? (e as string)
					}`
				);
			});
		}
	}

	/**
	 * Connects to the PubSub interface.
	 */
	connect(): void {
		if (!this._connection.isConnected && !this._connection.isConnecting) {
			this._logger.info('Connecting...');
			this._connection.connect();
		}
	}

	/**
	 * Disconnects from the PubSub interface.
	 */
	disconnect(): void {
		this._logger.info('Disconnecting...');
		this._connection.disconnect();
	}

	/**
	 * Reconnects to the PubSub interface.
	 */
	reconnect(): void {
		this.disconnect();
		this.connect();
	}

	/**
	 * Checks whether the client is currently connecting to the server.
	 */
	get isConnecting(): boolean {
		return this._connection.isConnecting;
	}

	/**
	 * Checks whether the client is currently connected to the server.
	 */
	get isConnected(): boolean {
		return this._connection.isConnected;
	}

	/** @private */
	get hasAnyTopics(): boolean {
		return this._topics.size > 0;
	}

	private async _sendListen(topics: string[], accessToken?: string) {
		await this._sendNonced(createListenPacket(topics, accessToken));
	}

	private async _sendUnlisten(topics: string[]) {
		await this._sendNonced({
			type: 'UNLISTEN',
			data: {
				topics
			}
		});
	}

	private static _wrapResolvable(resolvable: ResolvableValue<string> | TokenResolvable): TokenResolvable {
		switch (typeof resolvable) {
			case 'object': {
				return resolvable;
			}
			case 'string': {
				return {
					type: 'static',
					token: resolvable
				};
			}
			case 'function': {
				return {
					type: 'function',
					function: resolvable
				};
			}
			default: {
				throw new HellFreezesOverError(`Passed unknown type to wrapResolvable: ${typeof resolvable}`);
			}
		}
	}

	private async _resolveToken(resolvable: TokenResolvable): Promise<string | undefined> {
		switch (resolvable.type) {
			case 'provider': {
				const { provider, scopes, userId } = resolvable;
				const { accessToken } = await getValidTokenFromProviderForUser(provider, userId, scopes, this._logger);
				return accessToken.accessToken;
			}
			case 'function': {
				return await resolvable.function();
			}
			case 'static': {
				return resolvable.token;
			}
			default: {
				throw new HellFreezesOverError(
					`Passed unknown type to resolveToken: ${(resolvable as TokenResolvable).type}`
				);
			}
		}
	}

	private _resendListens() {
		const topicsByTokenResolvable = new Map<TokenResolvable, string[]>();
		for (const [topic, tokenResolvable] of this._topics) {
			if (topicsByTokenResolvable.has(tokenResolvable)) {
				topicsByTokenResolvable.get(tokenResolvable)!.push(topic);
			} else {
				topicsByTokenResolvable.set(tokenResolvable, [topic]);
			}
		}
		void Array.from(topicsByTokenResolvable)
			.reduce(
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				(chain, [tokenResolvable, topics]) =>
					// eslint-disable-next-line @typescript-eslint/return-await
					chain.then(async topicsByToken => {
						const token = await this._resolveToken(tokenResolvable);
						if (topicsByToken.has(token)) {
							topicsByToken.get(token)!.push(...topics);
						} else {
							topicsByToken.set(token, topics);
						}

						return topicsByToken;
					}),
				Promise.resolve(new Map<string | undefined, string[]>())
			)
			.then(topicsByToken => {
				for (const [token, topics] of topicsByToken) {
					this._sendListen(topics, token).catch(e => {
						for (const topic of topics) {
							this.emit(this.onListenError, topic, e, false);
						}
					});
				}
			});
	}

	private async _sendNonced<T extends PubSubNoncedOutgoingPacket>(packet: T) {
		await new Promise<void>((resolve, reject) => {
			const nonce = Math.random().toString(16).slice(2);

			const responseListener = this._onResponse((recvNonce, error) => {
				if (recvNonce === nonce) {
					if (error) {
						reject(new Error(`Error sending nonced ${packet.type} packet: ${error}`));
					} else {
						resolve();
					}
					responseListener.unbind();
				}
			});

			packet.nonce = nonce;

			this._sendPacket(packet);
		});
	}

	private _receiveMessage(dataStr: string) {
		this._logger.debug(`Received message: ${dataStr}`);
		const data = JSON.parse(dataStr) as PubSubIncomingPacket;

		switch (data.type) {
			case 'PONG': {
				this.emit(this._onPong);
				break;
			}
			case 'RECONNECT': {
				this.reconnect();
				break;
			}
			case 'RESPONSE': {
				this.emit(this._onResponse, data.nonce, data.error);
				break;
			}
			case 'MESSAGE': {
				this.emit(this.onMessage, data.data.topic, JSON.parse(data.data.message));
				break;
			}
			default: {
				this._logger.warn(
					`PubSub connection received unexpected message type: ${(data as PubSubIncomingPacket).type}`
				);
			}
		}
	}

	private _sendPacket(data: PubSubOutgoingPacket) {
		const dataStr = JSON.stringify(data);
		this._logger.debug(`Sending message: ${dataStr}`);
		this._connection.sendLine(dataStr);
	}

	private _pingCheck() {
		const pingTime = Date.now();
		this._onPong(() => {
			const latency = Date.now() - pingTime;
			this.emit(this.onPong, latency, pingTime);
			this._logger.info(`Current latency: ${latency}ms`);
			if (this._pingTimeoutTimer) {
				clearTimeout(this._pingTimeoutTimer);
			}
			this.removeInternalListener(this._onPong);
		});
		this._pingTimeoutTimer = setTimeout(async () => {
			this._logger.error('Ping timeout');
			this.removeInternalListener(this._onPong);
			this._connection.assumeExternalDisconnect();
		}, this._pingTimeout * 1000);
		this._sendPacket({ type: 'PING' });
	}

	private _startActivityPingCheckTimer() {
		clearInterval(this._activityPingCheckTimer);
		if (this._connection.isConnected) {
			this._activityPingCheckTimer = setInterval(() => {
				this._startInactivityPingCheckTimer();
				this._pingCheck();
			}, this._pingOnActivity * 1000);
		} else {
			this._activityPingCheckTimer = undefined;
		}
	}

	private _startInactivityPingCheckTimer() {
		clearInterval(this._inactivityPingCheckTimer);
		if (this._connection.isConnected) {
			this._inactivityPingCheckTimer = setInterval(() => {
				this._startActivityPingCheckTimer();
				this._pingCheck();
			}, this._pingOnInactivity * 1000);
		} else {
			this._inactivityPingCheckTimer = undefined;
		}
	}
}
