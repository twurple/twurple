import Subscription from './Subscription';
import { HelixFollow, HelixResponse } from 'twitch';
import WebHookListener from '../WebHookListener';
import { HelixFollowData } from 'twitch/lib/API/Helix/User/HelixFollow';

export default class FollowsToUserSubscription extends Subscription<HelixFollow> {
	constructor(private readonly _userId: string, handler: (data: HelixFollow) => void, client: WebHookListener) {
		super(handler, client);
	}

	protected async _subscribe() {
		return this._client._twitchClient.helix.webHooks.subscribeToUserFollowsTo(this._userId, this._options);
	}

	protected async _unsubscribe() {
		return this._client._twitchClient.helix.webHooks.unsubscribeFromUserFollowsTo(this._userId, this._options);
	}

	transformData(response: HelixResponse<HelixFollowData>) {
		return new HelixFollow(response.data[0], this._client._twitchClient);
	}
}
