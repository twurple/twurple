import Logger, { LogLevel } from '@d-fischer/logger';
import { EventEmitter, Listener } from '@d-fischer/typed-event-emitter';
import * as WebSocket from 'universal-websocket-client';
import { PubSubMessageData } from './Messages/PubSubMessage';
import { PubSubIncomingPacket, PubSubNoncedOutgoingPacket, PubSubOutgoingPacket } from './PubSubPacket';
import { NonEnumerable } from './Toolkit/Decorators';

/**
 * A client for the Twitch PubSub interface.
 */
export default class BasicPubSubClient extends EventEmitter {
	private _socket?: WebSocket;
	@NonEnumerable private readonly _logger: Logger;

	// topic => token
	@NonEnumerable private readonly _topics = new Map<string, string | undefined>();

	private _connecting: boolean = false;
	private _connected: boolean = false;
	private _manualDisconnect: boolean = false;
	private _initialConnect: boolean = false;

	private _pingCheckTimer?: NodeJS.Timer;
	private _pingTimeoutTimer?: NodeJS.Timer;
	private _retryTimer?: NodeJS.Timer;
	private _retryDelayGenerator?: IterableIterator<number>;

	private readonly _onPong: (handler: () => void) => Listener = this.registerEvent();
	private readonly _onResponse: (handler: (nonce: string, error: string) => void) => Listener = this.registerEvent();

	/**
	 * Fires when a message that matches your listening topics is received.
	 *
	 * @eventListener
	 * @param topic The name of the topic.
	 * @param message The message data.
	 */
	readonly onMessage: (
		handler: (topic: string, message: PubSubMessageData) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when the client finishes establishing a connection to the PubSub server.
	 *
	 * @eventListener
	 */
	readonly onConnect: (handler: () => void) => Listener = this.registerEvent();

	/**
	 * Fires when the client closes its connection to the PubSub server.
	 *
	 * @eventListener
	 * @param isError Whether the cause of the disconnection was an error. A reconnect will be attempted if this is true.
	 */
	readonly onDisconnect: (handler: (isError: boolean) => void) => Listener = this.registerEvent();

	/**
	 * Fires when the client receives a pong message from the PubSub server.
	 *
	 * @eventListener
	 * @param latency The current latency to the server, in milliseconds.
	 * @param requestTimestampe The time the ping request was sent to the PubSub server.
	 */
	readonly onPong: (handler: (latency: number, requestTimestamp: number) => void) => Listener = this.registerEvent();

	/**
	 * Creates a new PubSub client.
	 *
	 * @param logLevel The level of logging to use for the PubSub client.
	 */
	constructor(logLevel: LogLevel = LogLevel.WARNING) {
		super();
		this._logger = new Logger({
			name: 'twitch-pubsub-client',
			minLevel: logLevel
		});
	}

	/**
	 * Listens to one or more topics.
	 *
	 * @param topics A topic or a list of topics to listen to.
	 * @param accessToken An access token. Only necessary for some topics.
	 */
	async listen(topics: string | string[], accessToken?: string) {
		if (typeof topics === 'string') {
			topics = [topics];
		}

		for (const topic of topics) {
			this._topics.set(topic, accessToken);
		}

		if (this._connected) {
			await this._sendListen(topics, accessToken);
		}
	}

	/**
	 * Removes one or more topics from the listener.
	 *
	 * @param topics A topic or a list of topics to not listen to anymore.
	 */
	async unlisten(topics: string | string[]) {
		if (typeof topics === 'string') {
			topics = [topics];
		}

		for (const topic of topics) {
			this._topics.delete(topic);
		}

		if (this._connected) {
			await this._sendUnlisten(topics);
		}
	}

	/**
	 * Connects to the PubSub interface.
	 */
	async connect() {
		this._logger.info('Connecting...');
		return new Promise<void>((resolve, reject) => {
			if (this._connected || this._connecting) {
				resolve();
				return;
			}
			this._connecting = true;
			this._initialConnect = true;
			this._socket = new WebSocket('wss://pubsub-edge.twitch.tv');

			this._socket.onopen = async () => {
				this._connected = true;
				this._connecting = false;
				this._initialConnect = false;
				this._retryDelayGenerator = undefined;
				this._startPingCheckTimer();
				this._logger.info('Connection established');
				await this._resendListens();
				if (this._topics.size) {
					this._logger.info('Listened to previously registered topics');
					this._logger.debug2(`Previously registered topics: ${Array.from(this._topics.keys()).join(', ')}`);
				}
				this.emit(this.onConnect);
				resolve();
			};

			this._socket.onmessage = ({ data }: { data: WebSocket.Data }) => {
				this._receiveMessage(data.toString());
			};

			// The following empty error callback needs to exist so connection errors are passed down to `onclose` down below - otherwise the process just crashes instead
			this._socket.onerror = () => {};

			this._socket.onclose = ({ wasClean, code, reason }) => {
				if (this._pingCheckTimer) {
					clearInterval(this._pingCheckTimer);
				}
				if (this._pingTimeoutTimer) {
					clearTimeout(this._pingTimeoutTimer);
				}
				this._socket = undefined;
				this._connected = false;
				this._connecting = false;
				const wasInitialConnect = this._initialConnect;
				this._initialConnect = false;
				this.emit(this.onDisconnect, !wasClean && !this._manualDisconnect);
				if (!wasClean) {
					if (this._manualDisconnect) {
						this._manualDisconnect = false;
						this._logger.info('Successfully disconnected');
					} else {
						this._logger.err(`Connection unexpectedly closed: [${code}] ${reason}`);
						if (wasInitialConnect) {
							reject();
						}
						if (!this._retryDelayGenerator) {
							this._retryDelayGenerator = BasicPubSubClient._getReconnectWaitTime();
						}
						const delay = this._retryDelayGenerator.next().value;
						this._logger.info(`Reconnecting in ${delay} seconds`);
						this._retryTimer = setTimeout(async () => this.connect(), delay * 1000);
					}
				}
			};
		});
	}

	/**
	 * Disconnects from the PubSub interface.
	 */
	disconnect() {
		this._logger.info('Disconnecting...');
		if (this._retryTimer) {
			clearInterval(this._retryTimer);
		}
		this._retryDelayGenerator = undefined;
		if (this._socket) {
			this._manualDisconnect = true;
			this._socket.close();
		}
	}

	/**
	 * Reconnects to the PubSub interface.
	 */
	async reconnect() {
		this.disconnect();
		await this.connect();
	}

	private async _sendListen(topics: string[], accessToken?: string) {
		return this._sendNonced({
			type: 'LISTEN',
			data: {
				topics,
				auth_token: accessToken
			}
		});
	}

	private async _sendUnlisten(topics: string[]) {
		return this._sendNonced({
			type: 'UNLISTEN',
			data: {
				topics
			}
		});
	}

	private async _resendListens() {
		const topicsByToken = Array.from(this._topics.entries()).reduce((result, [topic, token]) => {
			if (result.has(token)) {
				result.get(token)!.push(topic);
			} else {
				result.set(token, [topic]);
			}

			return result;
		}, new Map<string | undefined, string[]>());
		return Promise.all(
			Array.from(topicsByToken.entries()).map(async ([token, topics]) => this._sendListen(topics, token))
		);
	}

	private async _sendNonced<T extends PubSubNoncedOutgoingPacket>(packet: T) {
		return new Promise<void>((resolve, reject) => {
			const nonce = Math.random()
				.toString(16)
				.slice(2);

			this._onResponse((recvNonce, error) => {
				if (recvNonce === nonce) {
					if (error) {
						reject(new Error(`Error sending nonced ${packet.type} packet: ${error}`));
					} else {
						resolve();
					}
				}
			});

			packet.nonce = nonce;

			this._sendPacket(packet);
		});
	}

	private _receiveMessage(dataStr: string) {
		this._logger.debug2(`Received message: ${dataStr}`);
		const data: PubSubIncomingPacket = JSON.parse(dataStr);

		switch (data.type) {
			case 'PONG': {
				this.emit(this._onPong);
				break;
			}
			case 'RECONNECT': {
				// tslint:disable-next-line:no-floating-promises
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
		this._logger.debug2(`Sending message: ${dataStr}`);

		if (this._socket && this._connected) {
			this._socket.send(dataStr);
		}
	}

	private _pingCheck() {
		const pingTime = Date.now();
		const pongListener = this._onPong(() => {
			const latency = Date.now() - pingTime;
			this.emit(this.onPong, latency, pingTime);
			this._logger.debug1(`Current latency: ${latency}ms`);
			if (this._pingTimeoutTimer) {
				clearTimeout(this._pingTimeoutTimer);
			}
			this.removeListener(pongListener);
		});
		this._pingTimeoutTimer = setTimeout(async () => {
			this._logger.err('Ping timeout');
			this.removeListener(pongListener);
			return this.reconnect();
		}, 10000);
		this._sendPacket({ type: 'PING' });
	}

	/**
	 * Checks whether the client is currently connecting to the server.
	 */
	protected get isConnecting() {
		return this._connecting;
	}

	/**
	 * Checks whether the client is currently connected to the server.
	 */
	protected get isConnected() {
		return this._connected;
	}

	private _startPingCheckTimer() {
		if (this._pingCheckTimer) {
			clearInterval(this._pingCheckTimer);
		}
		this._pingCheckTimer = setInterval(() => this._pingCheck(), 60000);
	}

	// yes, this is just fibonacci with a limit
	private static *_getReconnectWaitTime(): IterableIterator<number> {
		let current = 0;
		let next = 1;

		while (current < 120) {
			yield current;
			[current, next] = [next, current + next];
		}

		while (true) {
			yield 120;
		}
	}
}
