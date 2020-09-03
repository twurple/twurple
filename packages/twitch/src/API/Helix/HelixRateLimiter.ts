import { RateLimiterResponseParameters, ResponseBasedRateLimiter } from '@d-fischer/rate-limiter';
import { callTwitchApiRaw } from 'twitch-api-call';
import { TwitchApiCallOptionsInternal } from '../../ApiClient';

export class HelixRateLimiter extends ResponseBasedRateLimiter<TwitchApiCallOptionsInternal, Response> {
	protected async doRequest({ options, clientId, accessToken }: TwitchApiCallOptionsInternal): Promise<Response> {
		return callTwitchApiRaw(options, clientId, accessToken);
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
