import { type Response } from '@d-fischer/cross-fetch';
import type { RateLimiterResponseParameters } from '@d-fischer/rate-limiter';
import { ResponseBasedRateLimiter } from '@d-fischer/rate-limiter';
import { callTwitchApiRaw } from '@twurple/api-call';
import type { TwitchApiCallOptionsInternal } from '../client/ApiClient';

/** @internal */
export class HelixRateLimiter extends ResponseBasedRateLimiter<TwitchApiCallOptionsInternal, Response> {
	protected async doRequest({
		options,
		clientId,
		accessToken,
		authorizationType,
		fetchOptions
	}: TwitchApiCallOptionsInternal): Promise<Response> {
		return await callTwitchApiRaw(options, clientId, accessToken, authorizationType, fetchOptions);
	}

	protected needsToRetryAfter(res: Response): number | null {
		if (
			res.status === 429 &&
			(!res.headers.has('ratelimit-remaining') || Number(res.headers.get('ratelimit-remaining')!) === 0)
		) {
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
