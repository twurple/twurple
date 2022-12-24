import { type Logger } from '@d-fischer/logger';
import { type RateLimiter } from '@d-fischer/rate-limiter';
import { rtfm } from '@twurple/common';
import { type ApiConfig, type TwitchApiCallOptionsInternal } from './ApiClient';
import { BaseApiClient } from './BaseApiClient';

/** @private */
@rtfm('api', 'ApiClient')
export class UserContextApiClient extends BaseApiClient {
	constructor(
		config: ApiConfig,
		logger: Logger,
		rateLimiter: RateLimiter<TwitchApiCallOptionsInternal, Response>,
		private readonly _userId: string
	) {
		super(config, logger, rateLimiter);
	}

	protected _getUserIdFromRequestContext(): string | undefined {
		return this._userId;
	}
}
