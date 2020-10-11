import type { HelixResponse, HypeTrainEventData } from 'twitch';
import { HypeTrainEvent } from 'twitch';
import type { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
export class HypeTrainEventSubscription extends Subscription<HypeTrainEvent> {
	constructor(
		private readonly _broadcasterId: string,
		handler: (data: HypeTrainEvent) => void,
		client: WebHookListener,
		validityInSeconds = 100000
	) {
		super(handler, client, validityInSeconds);
	}

	get id(): string {
		return `hypetrain.event.${this._broadcasterId}`;
	}

	protected transformData(response: HelixResponse<HypeTrainEventData>): HypeTrainEvent {
		return new HypeTrainEvent(response.data[0], this._client._apiClient);
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
