import { HttpStatusCodeError } from '../errors/HttpStatusCodeError';

/** @private */
export async function transformTwitchApiResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		throw new HttpStatusCodeError(response.status, response.statusText, await response.json());
	}

	if (response.status === 204) {
		return undefined as unknown as T; // oof
	}

	const text = await response.text();

	if (!text) {
		return undefined as unknown as T; // mega oof - Twitch doesn't return a response when it should
	}

	return JSON.parse(text) as T;
}
