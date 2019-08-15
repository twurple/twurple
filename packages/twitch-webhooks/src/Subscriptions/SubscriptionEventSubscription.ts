import Subscription from './Subscription';
import { HelixResponse, HelixSubscriptionEvent } from 'twitch';
import WebHookListener from '../WebHookListener';
import { HelixSubscriptionEventData } from 'twitch/lib/API/Helix/Subscriptions/HelixSubscriptionEvent';

/**
 * @inheritDoc
 * @hideProtected
 */
export default class SubscriptionEventSubscription extends Subscription<HelixSubscriptionEvent> {
	constructor(
		private readonly _userId: string,
		handler: (data: HelixSubscriptionEvent) => void,
		client: WebHookListener,
		validityInSeconds = 100000
	) {
		super(handler, client, validityInSeconds);
	}

	get id() {
		return `subscription.event.${this._userId}`;
	}

	protected transformData(response: HelixResponse<HelixSubscriptionEventData>) {
		return new HelixSubscriptionEvent(response.data[0], this._client._twitchClient);
	}

	protected async _subscribe() {
		return this._client._twitchClient.helix.webHooks.subscribeToSubscriptionEvents(this._userId, this._options);
	}

	protected async _unsubscribe() {
		return this._client._twitchClient.helix.webHooks.unsubscribeFromSubscriptionEvents(this._userId, this._options);
	}
}
