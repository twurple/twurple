import { Enumerable } from '@d-fischer/shared-utils';
import { ApiClient } from '../ApiClient';

/** @private */
export class BaseApi {
	@Enumerable(false) protected readonly _client: ApiClient;

	constructor(client: ApiClient) {
		this._client = client;
	}
}
