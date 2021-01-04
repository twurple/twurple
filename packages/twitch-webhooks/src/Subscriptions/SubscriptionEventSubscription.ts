import type { HelixResponse, HelixSubscriptionEventData } from 'twitch';
import { HelixSubscriptionEvent } from 'twitch';
import type { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
export class SubscriptionEventSubscription extends Subscription<HelixSubscriptionEvent> {
	constructor(
		handler: (data: HelixSubscriptionEvent) => void,
		client: WebHookListener,
		validityInSeconds: number | undefined,
		private readonly _broadcasterId: string
	) {
		super(handler, client, validityInSeconds);
	}

	get id(): string {
		return `subscription.event.${this._broadcasterId}`;
	}

	protected transformData(response: HelixResponse<HelixSubscriptionEventData>): HelixSubscriptionEvent {
		return new HelixSubscriptionEvent(response.data[0], this._client._apiClient);
	}

	protected async _subscribe(): Promise<void> {
		return this._client._apiClient.helix.webHooks.subscribeToSubscriptionEvents(
			this._broadcasterId,
			await this._getOptions()
		);
	}

	protected async _unsubscribe(): Promise<void> {
		return this._client._apiClient.helix.webHooks.unsubscribeFromSubscriptionEvents(
			this._broadcasterId,
			await this._getOptions()
		);
	}
}
