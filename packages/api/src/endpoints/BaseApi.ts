import { Enumerable } from '@d-fischer/shared-utils';
import { type BaseApiClient } from '../client/BaseApiClient';

/** @private */
export class BaseApi {
	/** @private */
	@Enumerable(false) protected readonly _client: BaseApiClient;

	/** @private */
	constructor(client: BaseApiClient) {
		this._client = client;
	}
}
