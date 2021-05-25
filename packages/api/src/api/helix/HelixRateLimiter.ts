import type { RateLimiterResponseParameters } from '@d-fischer/rate-limiter';
import { ResponseBasedRateLimiter } from '@d-fischer/rate-limiter';
import { callTwitchApiRaw } from '@twurple/api-call';
import type { TwitchApiCallOptionsInternal } from '../../ApiClient';

/** @private */
export class HelixRateLimiter extends ResponseBasedRateLimiter<TwitchApiCallOptionsInternal, Response> {
	protected async doRequest({
		options,
		clientId,
		accessToken,
		fetchOptions
	}: TwitchApiCallOptionsInternal): Promise<Response> {
		return await callTwitchApiRaw(options, clientId, accessToken, fetchOptions);
	}

	protected needsToRetryAfter(res: Response): number | null {
		if (res.status === 429) {
			return +res.headers.get('ratelimit-reset')! * 1000 - Date.now();
		}
		return null;
	}

	protected getParametersFromResponse(res: Response): RateLimiterResponseParameters {
		const headers = res.headers;
		return {
			limit: +headers.get('ratelimit-limit')!,
			remaining: +headers.get('ratelimit-remaining')!,
			resetsAt: +headers.get('ratelimit-reset')! * 1000
		};
	}
}
