import { qsStringify } from '@twurple/common';
import { HttpStatusCodeError } from '../errors/HttpStatusCodeError.js';
import type { TwitchApiCallOptions } from '../TwitchApiCallOptions.js';

/** @private */
export async function handleTwitchApiResponseError(response: Response, options: TwitchApiCallOptions): Promise<void> {
	if (!response.ok) {
		const isJson = response.headers.get('Content-Type') === 'application/json';
		const text = isJson ? JSON.stringify(await response.json(), null, 2) : await response.text();
		const params = qsStringify(options.query);
		const fullUrl = `${options.url}${params}`;
		throw new HttpStatusCodeError(
			response.status,
			response.statusText,
			fullUrl,
			options.method ?? 'GET',
			text,
			isJson,
		);
	}
}

/** @private */
export async function transformTwitchApiResponse<T>(response: Response): Promise<T> {
	if (response.status === 204) {
		return undefined as unknown as T; // oof
	}

	const text = await response.text();

	if (!text) {
		return undefined as unknown as T; // mega oof - Twitch doesn't return a response when it should
	}

	return JSON.parse(text) as T;
}
