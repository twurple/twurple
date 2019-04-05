import Subscription from './Subscription';
import { HelixFollow, HelixResponse } from 'twitch';
import WebHookListener from '../WebHookListener';
import { HelixFollowData } from 'twitch/lib/API/Helix/User/HelixFollow';

export default class FollowsFromUserSubscription extends Subscription<HelixFollow> {
	constructor(private readonly _userId: string, handler: (data: HelixFollow) => void, client: WebHookListener) {
		super(handler, client);
	}

	transformData(response: HelixResponse<HelixFollowData>) {
		return new HelixFollow(response.data[0], this._client._twitchClient);
	}

	protected async _subscribe() {
		return this._client._twitchClient.helix.webHooks.subscribeToUserFollowsFrom(this._userId, this._options);
	}

	protected async _unsubscribe() {
		return this._client._twitchClient.helix.webHooks.unsubscribeFromUserFollowsFrom(this._userId, this._options);
	}
}
