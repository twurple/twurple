import type { HelixModeratorEventData, HelixResponse } from 'twitch';
import { HelixModeratorEvent } from 'twitch';
import type { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
export class ModeratorEventSubscription extends Subscription<HelixModeratorEvent> {
	constructor(
		handler: (data: HelixModeratorEvent) => void,
		client: WebHookListener,
		validityInSeconds: number | undefined,
		private readonly _broadcasterId: string,
		private readonly _userId?: string
	) {
		super(handler, client, validityInSeconds);
	}

	get id(): string {
		if (this._userId) {
			return `moderator.event.${this._broadcasterId}.${this._userId}`;
		}
		return `moderator.event.${this._broadcasterId}`;
	}

	protected transformData(response: HelixResponse<HelixModeratorEventData>): HelixModeratorEvent {
		return new HelixModeratorEvent(response.data[0], this._client._apiClient);
	}

	protected async _subscribe(): Promise<void> {
		if (this._userId) {
			return this._client._apiClient.helix.webHooks.subscribeToModeratorEventsForUser(
				this._broadcasterId,
				this._userId,
				await this._getOptions()
			);
		}
		return this._client._apiClient.helix.webHooks.subscribeToModeratorEvents(
			this._broadcasterId,
			await this._getOptions()
		);
	}

	protected async _unsubscribe(): Promise<void> {
		if (this._userId) {
			return this._client._apiClient.helix.webHooks.unsubscribeFromModeratorEventsForUser(
				this._broadcasterId,
				this._userId,
				await this._getOptions()
			);
		}
		return this._client._apiClient.helix.webHooks.unsubscribeFromModeratorEvents(
			this._broadcasterId,
			await this._getOptions()
		);
	}
}
