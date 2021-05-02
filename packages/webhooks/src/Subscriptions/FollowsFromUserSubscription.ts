import type { HelixFollowData, HelixResponse } from '@twurple/api';
import { HelixFollow } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
@rtfm('webhooks', 'Subscription')
export class FollowsFromUserSubscription extends Subscription<HelixFollow> {
	constructor(
		handler: (data: HelixFollow) => void,
		client: WebHookListener,
		validityInSeconds: number | undefined,
		private readonly _userId: string
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
		await this._client._apiClient.helix.webHooks.subscribeToUserFollowsFrom(this._userId, await this._getOptions());
	}

	protected async _unsubscribe(): Promise<void> {
		await this._client._apiClient.helix.webHooks.unsubscribeFromUserFollowsFrom(
			this._userId,
			await this._getOptions()
		);
	}
}
