import { HttpStatusCodeError } from '../errors/HttpStatusCodeError';

/** @private */
export async function transformTwitchApiResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		const isJson = response.headers.get('Content-Type') === 'application/json';
		const text = isJson ? JSON.stringify(await response.json(), null, 2) : await response.text();
		throw new HttpStatusCodeError(response.status, response.statusText, text, isJson);
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
