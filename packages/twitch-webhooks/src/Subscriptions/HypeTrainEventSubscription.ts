import type { HelixEventData, HelixHypeTrainEventData, HelixHypeTrainEventType, HelixResponse } from '@twurple/api';
import { HelixHypeTrainEvent } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
@rtfm('twitch-webhooks', 'Subscription')
export class HypeTrainEventSubscription extends Subscription<HelixHypeTrainEvent> {
	constructor(
		handler: (data: HelixHypeTrainEvent) => void,
		client: WebHookListener,
		validityInSeconds: number | undefined,
		private readonly _broadcasterId: string
	) {
		super(handler, client, validityInSeconds);
	}

	get id(): string {
		return `hypetrain.event.${this._broadcasterId}`;
	}

	protected transformData(
		response: HelixResponse<HelixEventData<HelixHypeTrainEventData, HelixHypeTrainEventType>>
	): HelixHypeTrainEvent {
		return new HelixHypeTrainEvent(response.data[0], this._client._apiClient);
	}

	protected async _subscribe(): Promise<void> {
		return this._client._apiClient.helix.webHooks.subscribeToHypeTrainEvents(
			this._broadcasterId,
			await this._getOptions()
		);
	}

	protected async _unsubscribe(): Promise<void> {
		return this._client._apiClient.helix.webHooks.unsubscribeFromHypeTrainEvents(
			this._broadcasterId,
			await this._getOptions()
		);
	}
}
