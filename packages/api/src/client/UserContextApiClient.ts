import { type Logger } from '@d-fischer/logger';
import { type RateLimiter } from '@d-fischer/rate-limiter';
import { rtfm } from '@twurple/common';
import { type ApiConfig, type TwitchApiCallOptionsInternal } from './ApiClient.js';
import { BaseApiClient } from './BaseApiClient.js';

/** @private */
@rtfm('api', 'ApiClient')
export class UserContextApiClient extends BaseApiClient {
	/** @internal */
	constructor(
		config: ApiConfig,
		logger: Logger,
		rateLimiter: RateLimiter<TwitchApiCallOptionsInternal, Response>,
		private readonly _userId: string,
	) {
		super(config, logger, rateLimiter);
	}

	/** @internal */
	_getUserIdFromRequestContext(): string | undefined {
		return this._userId;
	}
}
