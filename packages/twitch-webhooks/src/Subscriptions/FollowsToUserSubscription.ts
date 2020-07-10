import { HelixFollow, HelixResponse } from 'twitch';
import { HelixFollowData } from 'twitch/lib/API/Helix/User/HelixFollow';
import { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
export class FollowsToUserSubscription extends Subscription<HelixFollow> {
	constructor(
		private readonly _userId: string,
		handler: (data: HelixFollow) => void,
		client: WebHookListener,
		validityInSeconds = 100000
	) {
		super(handler, client, validityInSeconds);
	}

	get id() {
		return `follows.to.${this._userId}`;
	}

	protected transformData(response: HelixResponse<HelixFollowData>) {
		return new HelixFollow(response.data[0], this._client._apiClient);
	}

	protected async _subscribe() {
		return this._client._apiClient.helix.webHooks.subscribeToUserFollowsTo(
			this._userId,
			await this._getOptions()
		);
	}

	protected async _unsubscribe() {
		return this._client._apiClient.helix.webHooks.unsubscribeFromUserFollowsTo(
			this._userId,
			await this._getOptions()
		);
	}
}
