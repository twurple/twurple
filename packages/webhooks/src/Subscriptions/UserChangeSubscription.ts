import type { HelixResponse, HelixUserData } from '@twurple/api';
import { HelixUser } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
@rtfm('webhooks', 'Subscription')
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
		await this._client._apiClient.helix.webHooks.subscribeToUserChanges(
			this._userId,
			await this._getOptions(),
			this._withEmail
		);
	}

	protected async _unsubscribe(): Promise<void> {
		await this._client._apiClient.helix.webHooks.unsubscribeFromUserChanges(this._userId, await this._getOptions());
	}
}
