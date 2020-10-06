import type { HelixFollowData, HelixResponse } from 'twitch';
import { HelixFollow } from 'twitch';
import type { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
export class FollowsFromUserSubscription extends Subscription<HelixFollow> {
	constructor(
		private readonly _userId: string,
		handler: (data: HelixFollow) => void,
		client: WebHookListener,
		validityInSeconds = 100000
	) {
		super(handler, client, validityInSeconds);
	}

	get id(): string {
		return `follows.from.${this._userId}`;
	}

	protected transformData(response: HelixResponse<HelixFollowData>): HelixFollow {
		return new HelixFollow(response.data[0], this._client._apiClient);
	}

	protected async _subscribe(): Promise<void> {
		return this._client._apiClient.helix.webHooks.subscribeToUserFollowsFrom(
			this._userId,
			await this._getOptions()
		);
	}

	protected async _unsubscribe(): Promise<void> {
		return this._client._apiClient.helix.webHooks.unsubscribeFromUserFollowsFrom(
			this._userId,
			await this._getOptions()
		);
	}
}
