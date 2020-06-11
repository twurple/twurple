import { HelixModeratorEvent, HelixResponse } from 'twitch';
import { HelixModeratorEventData } from 'twitch/lib/API/Helix/Moderation/HelixModeratorEvent';
import WebHookListener from '../WebHookListener';
import Subscription from './Subscription';

/**
 * @private
 */
export default class ModeratorEventSubscription extends Subscription<HelixModeratorEvent> {
	constructor(
		private readonly _broadcasterId: string,
		handler: (data: HelixModeratorEvent) => void,
		client: WebHookListener,
		private readonly _userId?: string,
		validityInSeconds = 100000
	) {
		super(handler, client, validityInSeconds);
	}

	get id() {
		if (this._userId) {
			return `moderator.event.${this._broadcasterId}.${this._userId}`;
		}
		return `moderator.event.${this._broadcasterId}`;
	}

	protected transformData(response: HelixResponse<HelixModeratorEventData>) {
		return new HelixModeratorEvent(response.data[0], this._client._twitchClient);
	}

	protected async _subscribe() {
		if (this._userId) {
			return this._client._twitchClient.helix.webHooks.subscribeToModeratorEventsForUser(
				this._broadcasterId,
				this._userId,
				await this._getOptions()
			);
		}
		return this._client._twitchClient.helix.webHooks.subscribeToModeratorEvents(
			this._broadcasterId,
			await this._getOptions()
		);
	}

	protected async _unsubscribe() {
		if (this._userId) {
			return this._client._twitchClient.helix.webHooks.unsubscribeFromModeratorEventsForUser(
				this._broadcasterId,
				this._userId,
				await this._getOptions()
			);
		}
		return this._client._twitchClient.helix.webHooks.unsubscribeFromModeratorEvents(
			this._broadcasterId,
			await this._getOptions()
		);
	}
}
