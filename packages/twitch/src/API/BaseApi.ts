import { Enumerable } from '@d-fischer/shared-utils';
import { ApiClient } from '../ApiClient';

/** @private */
export class BaseApi {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(client: ApiClient) {
		this._client = client;
	}
}
