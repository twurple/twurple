import { HelixResponse, HelixUser } from 'twitch';
import { HelixUserData } from 'twitch/lib/API/Helix/User/HelixUser';
import { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
export class UserChangeSubscription extends Subscription<HelixUser> {
	constructor(
		private readonly _userId: string,
		handler: (data: HelixUser) => void,
		private readonly _withEmail: boolean,
		client: WebHookListener,
		validityInSeconds = 100000
	) {
		super(handler, client, validityInSeconds);
	}

	get id() {
		return `user.change.${this._userId}`;
	}

	protected transformData(response: HelixResponse<HelixUserData>) {
		return new HelixUser(response.data[0], this._client._twitchClient);
	}

	protected async _subscribe() {
		return this._client._twitchClient.helix.webHooks.subscribeToUserChanges(
			this._userId,
			await this._getOptions(),
			this._withEmail
		);
	}

	protected async _unsubscribe() {
		return this._client._twitchClient.helix.webHooks.unsubscribeFromUserChanges(
			this._userId,
			await this._getOptions()
		);
	}
}
