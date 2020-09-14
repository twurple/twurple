import { HypeTrainEvent, HelixResponse } from 'twitch';
import { HypeTrainEventData } from 'twitch/lib/API/Helix/HypeTrain/HypeTrainEvent';
import { WebHookListener } from '../WebHookListener';
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

	get broadcasterId() {
		return `hypetrain.event.${this._broadcasterId}`;
	}

	protected async _subscribe() {
		return this._client._apiClient.helix.webHooks.subscribeToHypeTrainEvents(
			this._broadcasterId,
			await this._getOptions()
		);
	}

	protected async _unsubscribe() {
		return this._client._apiClient.helix.webHooks.unsubscribeFromModeratorEvents(
			this._broadcasterId,
			await this._getOptions()
		);
	}

	get id() {
		return `hypetrain.event.${this._broadcasterId}`;
	}

	protected transformData(response: HelixResponse<HypeTrainEventData>) {
		return new HypeTrainEvent(response.data[0], this._client._apiClient);
	}
}
