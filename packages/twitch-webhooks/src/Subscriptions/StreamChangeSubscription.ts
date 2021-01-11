import type { HelixResponse, HelixStreamData } from 'twitch';
import { HelixStream } from 'twitch';
import { rtfm } from 'twitch-common';
import type { WebHookListener } from '../WebHookListener';
import { Subscription } from './Subscription';

/**
 * @private
 */
@rtfm('twitch-webhooks', 'Subscription')
export class StreamChangeSubscription extends Subscription<HelixStream | undefined> {
	constructor(
		handler: (data: HelixStream | undefined) => void,
		client: WebHookListener,
		validityInSeconds: number | undefined,
		private readonly _userId: string
	) {
		super(handler, client, validityInSeconds);
	}

	get id(): string {
		return `stream.change.${this._userId}`;
	}

	protected transformData(response: HelixResponse<HelixStreamData>): HelixStream | undefined {
		if (!response.data.length) {
			return undefined;
		}
		return new HelixStream(response.data[0], this._client._apiClient);
	}

	protected async _subscribe(): Promise<void> {
		return this._client._apiClient.helix.webHooks.subscribeToStreamChanges(this._userId, await this._getOptions());
	}

	protected async _unsubscribe(): Promise<void> {
		return this._client._apiClient.helix.webHooks.unsubscribeFromStreamChanges(
			this._userId,
			await this._getOptions()
		);
	}
}
