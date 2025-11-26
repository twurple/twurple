import { Enumerable } from '@d-fischer/shared-utils';
import { type BaseApiClient } from '../client/BaseApiClient.js';

/** @private */
export class BaseApi {
	/** @internal */ @Enumerable(false) protected readonly _client: BaseApiClient;

	/** @internal */
	constructor(client: BaseApiClient) {
		this._client = client;
	}

	/** @internal */
	protected _getUserContextIdWithDefault(userId: string): string {
		return this._client._getUserIdFromRequestContext(userId) ?? userId;
	}
}
