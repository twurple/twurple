import PubSubClient from './PubSubClient';
import Twitch from '../';
import { NonEnumerable } from '../Toolkit/Decorators';
import RefreshableAuthProvider from '../Auth/RefreshableAuthProvider';
import PubSubMessage, { PubSubBitsMessage, PubSubCommerceMessage, PubSubSubscriptionMessage, PubSubWhisperMessage } from './PubSubMessage';
import { PubSubListener } from './PubSubListener';

export default class SingleUserPubSubClient {
	@NonEnumerable private readonly _twitchClient: Twitch;
	@NonEnumerable private readonly _pubSubClient: PubSubClient;

	private readonly _listeners: Map<string, PubSubListener[]> = new Map;

	constructor(twitchClient: Twitch, pubSubClient?: PubSubClient) {
		this._twitchClient = twitchClient;
		this._pubSubClient = pubSubClient || new PubSubClient();
		this._pubSubClient.onMessage((topic, message) => {
			const [type] = topic.split('.');
			if (this._listeners.has(type)) {
				this._listeners.get(type)!.forEach(l => l.call(message));
			}
		});
	}

	private async _getUserData(scope?: string) {
		let accessToken = await this._twitchClient._config.authProvider.getAccessToken(scope);
		let userId: string;
		try {
			userId = (await this._twitchClient.getTokenInfo()).userId!;
		} catch (e) {
			if (this._twitchClient._config.authProvider instanceof RefreshableAuthProvider) {
				accessToken = (await this._twitchClient._config.authProvider.refresh()).accessToken;
				userId = (await this._twitchClient.getTokenInfo()).userId!;
			} else {
				throw e;
			}
		}

		return { userId, accessToken };
	}

	private async _addListener<T extends PubSubMessage>(type: string, callback: (message: T) => void, scope?: string) {
		await this._pubSubClient.connect();
		const { userId, accessToken } = await this._getUserData(scope);
		const listener = new PubSubListener(type, userId, callback, this);
		if (this._listeners.has(type)) {
			this._listeners.get(type)!.push(listener);
		} else {
			this._listeners.set(type, [listener]);
			await this._pubSubClient.listen(`${type}.${userId}`, accessToken);
		}
		return listener;
	}

	async addBitsListener(callback: (message: PubSubBitsMessage) => void) {
		return this._addListener('channel-bits-events-v1', callback);
	}

	async addSubListener(callback: (message: PubSubSubscriptionMessage) => void) {
		return this._addListener('channel-subscribe-events-v1', callback, 'channel_subscriptions');
	}

	async addCommerceListener(callback: (message: PubSubCommerceMessage) => void) {
		return this._addListener('channel-commerce-events-v1', callback);
	}

	async addWhisperListener(callback: (message: PubSubWhisperMessage) => void) {
		return this._addListener('whispers', callback, 'chat_login');
	}

	removeListener(listener: PubSubListener) {
		if (this._listeners.has(listener.type)) {
			const newListeners = this._listeners.get(listener.type)!.filter(l => l !== listener);
			if (newListeners.length === 0) {
				this._listeners.delete(listener.type);
				// tslint:disable-next-line:no-floating-promises
				this._pubSubClient.unlisten(`${listener.type}.${listener.userId}`);
			} else {
				this._listeners.set(listener.type, newListeners);
			}
		}
	}
}
