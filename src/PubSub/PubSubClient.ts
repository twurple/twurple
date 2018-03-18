import * as WebSocket from 'universal-websocket-client';
import * as randomstring from 'randomstring';
import { EventEmitter, Listener } from 'ircv3/lib/TypedEventEmitter';
import { PubSubIncomingPacket, PubSubNoncedOutgoingPacket, PubSubOutgoingPacket } from './PubSubPacket';
import { PubSubMessageData } from './Messages/PubSubMessage';

export default class PubSubClient extends EventEmitter {
	private _socket?: WebSocket;

	private _connecting: boolean = false;
	private _connected: boolean = false;
	private _manualDisconnect: boolean = false;
	private _initialConnect: boolean = false;

	private _pingCheckTimer: NodeJS.Timer;
	private _pingTimeoutTimer: NodeJS.Timer;
	private _retryTimer: NodeJS.Timer;
	private _retryDelayGenerator?: IterableIterator<number>;

	private readonly _onPong: (handler: () => void) => Listener = this.registerEvent();
	private readonly _onResponse: (handler: (nonce: string, error: string) => void) => Listener = this.registerEvent();
	/** @eventListener */
	readonly onMessage: (handler: (topic: string, message: PubSubMessageData) => void) => Listener = this.registerEvent();

	constructor(private readonly _debugLevel: number = 0) {
		super();
	}

	async listen(topics: string | string[], authToken?: string) {
		if (typeof topics === 'string') {
			topics = [topics];
		}

		return this._sendNonced({
			type: 'LISTEN',
			data: {
				topics,
				auth_token: authToken
			}
		});
	}

	async unlisten(topics: string | string[]) {
		if (typeof topics === 'string') {
			topics = [topics];
		}

		return this._sendNonced({
			type: 'UNLISTEN',
			data: {
				topics
			}
		});
	}

	private async _sendNonced<T extends PubSubNoncedOutgoingPacket>(packet: T) {
		return new Promise<void>((resolve, reject) => {
			const nonce = randomstring.generate(16);

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

	async connect() {
		return new Promise<void>((resolve, reject) => {
			if (this._connected) {
				resolve();
				return;
			}
			this._connecting = true;
			this._initialConnect = true;
			this._socket = new WebSocket('wss://pubsub-edge.twitch.tv');
			this._socket.on('open', () => {
				this._connected = true;
				this._connecting = false;
				this._initialConnect = false;
				this._retryDelayGenerator = undefined;
				this._startPingCheckTimer();
				resolve();
			});
			this._socket.onmessage = ({ data }: { data: WebSocket.Data }) => {
				this._receiveMessage(data.toString());
			};
			this._socket.onclose = ({ wasClean, code, reason }) => {
				clearInterval(this._pingCheckTimer);
				clearTimeout(this._pingTimeoutTimer);
				this._socket = undefined;
				this._connected = false;
				this._connecting = false;
				const wasInitialConnect = this._initialConnect;
				this._initialConnect = false;
				if (!wasClean) {
					if (this._manualDisconnect) {
						this._manualDisconnect = false;
					} else {
						// tslint:disable-next-line:no-console
						console.error(`PubSub connection unexpectedly closed: [${code}] ${reason}`);
						if (wasInitialConnect) {
							reject();
						}
						if (!this._retryDelayGenerator) {
							this._retryDelayGenerator = PubSubClient._getReconnectWaitTime();
						}
						const delay = this._retryDelayGenerator.next().value;
						// tslint:disable-next-line:no-console
						console.log(`Reconnecting in ${delay} seconds`);
						this._retryTimer = setTimeout(async () => this.connect(), delay * 1000);
					}
				}
			};
		});
	}

	private _receiveMessage(dataStr: string) {
		const data: PubSubIncomingPacket = JSON.parse(dataStr);

		if (this._debugLevel >= 1) {
			// tslint:disable-next-line:no-console
			console.log('>', data);
		}

		switch (data.type) {
			case 'PONG': {
				this.emit(this._onPong);
				break;
			}
			case 'RECONNECT': {
				// tslint:disable-next-line:no-floating-promises
				this._reconnect();
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
				// tslint:disable-next-line:no-any
				console.warn(`PubSub connection received unexpected message type: ${(data as any).type}`);
			}
		}
	}

	protected _sendPacket(data: PubSubOutgoingPacket) {
		if (this._debugLevel >= 1) {
			// tslint:disable-next-line:no-console
			console.log('<', data);
		}

		if (this._socket && this._connected) {
			this._socket.send(JSON.stringify(data));
		}
	}

	private _pingCheck() {
		const pongListener = this._onPong(() => {
			clearTimeout(this._pingTimeoutTimer);
			this.removeListener(pongListener);
		});
		this._pingTimeoutTimer = setTimeout(
			async () => {
				this.removeListener(pongListener);
				return this._reconnect();
			},
			10000
		);
		this._sendPacket({ type: 'PING' });
	}

	private _disconnect() {
		clearInterval(this._retryTimer);
		this._retryDelayGenerator = undefined;
		if (this._socket) {
			this._manualDisconnect = true;
			this._socket.close();
		}
	}

	private async _reconnect() {
		this._disconnect();
		await this.connect();
	}

	protected get isConnecting() {
		return this._connecting;
	}

	protected get isConnected() {
		return this._connected;
	}

	private _startPingCheckTimer() {
		clearInterval(this._pingCheckTimer);
		this._pingCheckTimer = setInterval(
			() => this._pingCheck(),
			60000
		);
	}

	// yes, this is just fibonacci with a limit
	private static * _getReconnectWaitTime(): IterableIterator<number> {
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
