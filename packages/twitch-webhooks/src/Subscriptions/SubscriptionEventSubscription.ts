import type { HelixResponse, HelixSubscriptionEventData } from 'twitch';
import { HelixSubscriptionEvent } from 'twitch';
import type { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
export class SubscriptionEventSubscription extends Subscription<HelixSubscriptionEvent> {
	constructor(
		private readonly _userId: string,
		handler: (data: HelixSubscriptionEvent) => void,
		client: WebHookListener,
		validityInSeconds = 100000
	) {
		super(handler, client, validityInSeconds);
	}

	get id(): string {
		return `subscription.event.${this._userId}`;
	}

	protected transformData(response: HelixResponse<HelixSubscriptionEventData>): HelixSubscriptionEvent {
		return new HelixSubscriptionEvent(response.data[0], this._client._apiClient);
	}

	protected async _subscribe(): Promise<void> {
		return this._client._apiClient.helix.webHooks.subscribeToSubscriptionEvents(
			this._userId,
			await this._getOptions()
		);
	}

	protected async _unsubscribe(): Promise<void> {
		return this._client._apiClient.helix.webHooks.unsubscribeFromSubscriptionEvents(
			this._userId,
			await this._getOptions()
		);
	}
}
