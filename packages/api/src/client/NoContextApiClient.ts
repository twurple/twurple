import { rtfm } from '@twurple/common';
import { BaseApiClient } from './BaseApiClient';

/** @private */
@rtfm('api', 'ApiClient')
export class NoContextApiClient extends BaseApiClient {
	/** @internal */
	_getUserIdFromRequestContext(): null {
		return null;
	}
}
