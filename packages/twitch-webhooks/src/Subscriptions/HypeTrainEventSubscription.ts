import type { HelixResponse, HelixHypeTrainEventData } from 'twitch';
import { HelixHypeTrainEvent } from 'twitch';
import type { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
export class HypeTrainEventSubscription extends Subscription<HelixHypeTrainEvent> {
	constructor(
		private readonly _broadcasterId: string,
		handler: (data: HelixHypeTrainEvent) => void,
		client: WebHookListener,
		validityInSeconds = 100000
	) {
		super(handler, client, validityInSeconds);
	}

	get id(): string {
		return `hypetrain.event.${this._broadcasterId}`;
	}

	protected transformData(response: HelixResponse<HelixHypeTrainEventData>): HelixHypeTrainEvent {
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
