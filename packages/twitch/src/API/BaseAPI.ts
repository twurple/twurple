import { Enumerable } from '@d-fischer/shared-utils';
import { TwitchClient } from '../TwitchClient';

/** @private */
export class BaseAPI {
	@Enumerable(false) protected readonly _client: TwitchClient;

	constructor(client: TwitchClient) {
		this._client = client;
	}
}
