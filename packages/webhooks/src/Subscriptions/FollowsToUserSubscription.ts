import type { HelixFollowData, HelixResponse } from '@twurple/api';
import { HelixFollow } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
@rtfm('webhooks', 'Subscription')
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
		await this._client._apiClient.helix.webHooks.subscribeToUserFollowsTo(this._userId, await this._getOptions());
	}

	protected async _unsubscribe(): Promise<void> {
		await this._client._apiClient.helix.webHooks.unsubscribeFromUserFollowsTo(
			this._userId,
			await this._getOptions()
		);
	}
}
