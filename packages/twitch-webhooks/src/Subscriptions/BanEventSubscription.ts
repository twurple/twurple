import type { HelixBanEventData, HelixResponse } from 'twitch';
import { HelixBanEvent } from 'twitch';
import { rtfm } from 'twitch-common';
import type { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
@rtfm('twitch-webhooks', 'Subscription')
export class BanEventSubscription extends Subscription<HelixBanEvent> {
	constructor(
		handler: (data: HelixBanEvent) => void,
		client: WebHookListener,
		validityInSeconds: number | undefined,
		private readonly _broadcasterId: string,
		private readonly _userId?: string
	) {
		super(handler, client, validityInSeconds);
	}

	get id(): string {
		if (this._userId) {
			return `ban.event.${this._broadcasterId}.${this._userId}`;
		}
		return `ban.event.${this._broadcasterId}`;
	}

	protected transformData(response: HelixResponse<HelixBanEventData>): HelixBanEvent {
		return new HelixBanEvent(response.data[0], this._client._apiClient);
	}

	protected async _subscribe(): Promise<void> {
		if (this._userId) {
			return this._client._apiClient.helix.webHooks.subscribeToBanEventsForUser(
				this._broadcasterId,
				this._userId,
				await this._getOptions()
			);
		}
		return this._client._apiClient.helix.webHooks.subscribeToBanEvents(
			this._broadcasterId,
			await this._getOptions()
		);
	}

	protected async _unsubscribe(): Promise<void> {
		if (this._userId) {
			return this._client._apiClient.helix.webHooks.unsubscribeFromBanEventsForUser(
				this._broadcasterId,
				this._userId,
				await this._getOptions()
			);
		}
		return this._client._apiClient.helix.webHooks.unsubscribeFromBanEvents(
			this._broadcasterId,
			await this._getOptions()
		);
	}
}
