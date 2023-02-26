import { rtfm } from '@twurple/common';
import { BaseApiClient } from './BaseApiClient';

/** @private */
@rtfm('api', 'ApiClient')
export class NoContextApiClient extends BaseApiClient {
	protected _getUserIdFromRequestContext(): null {
		return null;
	}
}
