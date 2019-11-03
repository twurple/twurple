import { ResponseBasedRateLimiter, RateLimiterResponseParameters } from '@d-fischer/rate-limiter';
import TwitchClient, { TwitchAPICallOptionsInternal } from '../../TwitchClient';

export default class HelixRateLimiter extends ResponseBasedRateLimiter<TwitchAPICallOptionsInternal, Response> {
	protected async doRequest({ options, clientId, accessToken }: TwitchAPICallOptionsInternal): Promise<Response> {
		return TwitchClient._callAPIRaw(options, clientId, accessToken);
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
