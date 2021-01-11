import type { HelixFollowData, HelixResponse } from 'twitch';
import { HelixFollow } from 'twitch';
import { rtfm } from 'twitch-common';
import type { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
@rtfm('twitch-webhooks', 'Subscription')
export class FollowsToUserSubscription extends Subscription<HelixFollow> {
	constructor(
		handler: (data: HelixFollow) => void,
		client: WebHookListener,
		validityInSeconds: number | undefined,
		private readonly _userId: string
	) {
		super(handler, client, validityInSeconds);
	}

	get id(): string {
		return `follows.to.${this._userId}`;
	}

	protected transformData(response: HelixResponse<HelixFollowData>): HelixFollow {
		return new HelixFollow(response.data[0], this._client._apiClient);
	}

	protected async _subscribe(): Promise<void> {
		return this._client._apiClient.helix.webHooks.subscribeToUserFollowsTo(this._userId, await this._getOptions());
	}

	protected async _unsubscribe(): Promise<void> {
		return this._client._apiClient.helix.webHooks.unsubscribeFromUserFollowsTo(
			this._userId,
			await this._getOptions()
		);
	}
}
