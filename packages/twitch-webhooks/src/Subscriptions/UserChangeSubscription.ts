import type { HelixResponse, HelixUserData } from 'twitch';
import { HelixUser } from 'twitch';
import { rtfm } from 'twitch-common';
import type { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
@rtfm('twitch-webhooks', 'Subscription')
export class UserChangeSubscription extends Subscription<HelixUser> {
	constructor(
		handler: (data: HelixUser) => void,
		client: WebHookListener,
		validityInSeconds: number | undefined,
		private readonly _userId: string,
		private readonly _withEmail: boolean
	) {
		super(handler, client, validityInSeconds);
	}

	get id(): string {
		return `user.change.${this._userId}`;
	}

	protected transformData(response: HelixResponse<HelixUserData>): HelixUser {
		return new HelixUser(response.data[0], this._client._apiClient);
	}

	protected async _subscribe(): Promise<void> {
		return this._client._apiClient.helix.webHooks.subscribeToUserChanges(
			this._userId,
			await this._getOptions(),
			this._withEmail
		);
	}

	protected async _unsubscribe(): Promise<void> {
		return this._client._apiClient.helix.webHooks.unsubscribeFromUserChanges(
			this._userId,
			await this._getOptions()
		);
	}
}
