import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '../../../ApiClient';

/** @private */
export interface HelixWebHookSubscriptionData {
	topic: string;
	callback: string;
	expires_at: string;
}

/**
 * A subscription to a Twitch WebHook.
 */
export class HelixWebHookSubscription {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: HelixWebHookSubscriptionData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The topic the WebHook is listening to.
	 */
	get topicUrl(): string {
		return this._data.topic;
	}

	/**
	 * The URL that will be called for every subscribed event.
	 */
	get callbackUrl(): string {
		return this._data.callback;
	}

	/**
	 * The time when the subscription will expire.
	 */
	get expiryDate(): Date {
		return new Date(this._data.expires_at);
	}

	/**
	 * Unsubscribe from the WebHook.
	 */
	async unsubscribe(): Promise<void> {
		return this._client.helix.webHooks.sendHubRequest({
			mode: 'unsubscribe',
			topicUrl: this.topicUrl,
			callbackUrl: this.callbackUrl
		});
	}
}
