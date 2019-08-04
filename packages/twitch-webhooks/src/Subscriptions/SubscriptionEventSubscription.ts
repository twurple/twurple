import Subscription from './Subscription';
import { HelixResponse } from 'twitch';
import WebHookListener from '../WebHookListener';
import HelixSubscriptionEvent, { HelixSubscriptionEventData } from 'twitch/lib/API/Helix/Subscriptions/HelixSubscriptionEvent';

export default class SubscriptionsToUserSubscription extends Subscription<HelixSubscriptionEvent> {
  constructor(private readonly _userId: string, handler: (data: HelixSubscriptionEvent) => void, client: WebHookListener) {
    super(handler, client);
  }

  transformData(response: HelixResponse<HelixSubscriptionEventData>) {
    return new HelixSubscriptionEvent(response.data[0], this._client._twitchClient);
  }

  protected async _subscribe() {
		return this._client._twitchClient.helix.webHooks.subscribeToUserSubscriptionEvents(this._userId, this._options);
	}

	protected async _unsubscribe() {
		return this._client._twitchClient.helix.webHooks.unsubscribeFromUserSubscriptionEvents(this._userId, this._options);
	}
}
