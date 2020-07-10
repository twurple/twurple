import { HelixResponse, HelixStream } from 'twitch';
import { HelixStreamData } from 'twitch/lib/API/Helix/Stream/HelixStream';
import { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
export class StreamChangeSubscription extends Subscription<HelixStream | undefined> {
	constructor(
		private readonly _userId: string,
		handler: (data: HelixStream) => void,
		client: WebHookListener,
		validityInSeconds = 100000
	) {
		super(handler, client, validityInSeconds);
	}

	get id() {
		return `stream.change.${this._userId}`;
	}

	protected transformData(response: HelixResponse<HelixStreamData>) {
		if (!response.data.length) {
			return undefined;
		}
		return new HelixStream(response.data[0], this._client._apiClient);
	}

	protected async _subscribe() {
		return this._client._apiClient.helix.webHooks.subscribeToStreamChanges(
			this._userId,
			await this._getOptions()
		);
	}

	protected async _unsubscribe() {
		return this._client._apiClient.helix.webHooks.unsubscribeFromStreamChanges(
			this._userId,
			await this._getOptions()
		);
	}
}
