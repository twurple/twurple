import { HelixBanEvent, HelixResponse } from 'twitch';
import { HelixBanEventData } from 'twitch/lib/API/Helix/Moderation/HelixBanEvent';
import WebHookListener from '../WebHookListener';
import Subscription from './Subscription';

/**
 * @inheritDoc
 * @hideProtected
 */
export default class BanEventSubscription extends Subscription<HelixBanEvent> {
	/** @private */
	constructor(
		private readonly _broadcasterId: string,
		handler: (data: HelixBanEvent) => void,
		client: WebHookListener,
		private readonly _userId?: string,
		validityInSeconds = 100000
	) {
		super(handler, client, validityInSeconds);
	}

	get id() {
		if (this._userId) {
			return `ban.event.${this._broadcasterId}.${this._userId}`;
		}
		return `ban.event.${this._broadcasterId}`;
	}

	protected transformData(response: HelixResponse<HelixBanEventData>) {
		return new HelixBanEvent(response.data[0], this._client._twitchClient);
	}

	protected async _subscribe() {
		if (this._userId) {
			return this._client._twitchClient.helix.webHooks.subscribeToBanEventsForUser(
				this._broadcasterId,
				this._userId,
				this._options
			);
		}
		return this._client._twitchClient.helix.webHooks.subscribeToBanEvents(this._broadcasterId, this._options);
	}

	protected async _unsubscribe() {
		if (this._userId) {
			return this._client._twitchClient.helix.webHooks.unsubscribeFromBanEventsForUser(
				this._broadcasterId,
				this._userId,
				this._options
			);
		}
		return this._client._twitchClient.helix.webHooks.unsubscribeFromBanEvents(this._broadcasterId, this._options);
	}
}
