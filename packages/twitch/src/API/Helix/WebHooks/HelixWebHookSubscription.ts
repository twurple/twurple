import TwitchClient from '../../../TwitchClient';
import { NonEnumerable } from '../../../Toolkit/Decorators/NonEnumerable';

/** @private */
export interface HelixWebHookSubscriptionData {
	topic: string;
	callback: string;
	expires_at: string;
}

/**
 * A subscription to a Twitch WebHook.
 */
export default class HelixWebHookSubscription {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: HelixWebHookSubscriptionData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The topic the WebHook is listening to.
	 */
	get topicUrl() {
		return this._data.topic;
	}

	/**
	 * The URL that will be called for every subscribed event.
	 */
	get callbackUrl() {
		return this._data.callback;
	}

	/**
	 * The time when the subscription will expire.
	 */
	get expiryDate() {
		return new Date(this._data.expires_at);
	}
}
