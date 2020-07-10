import { HttpStatusCodeError } from '../errors/HttpStatusCodeError';

/** @private */
export async function transformTwitchApiResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		throw new HttpStatusCodeError(response.status, response.statusText, await response.json());
	}

	if (response.status === 204) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (undefined as any) as T; // oof
	}

	const text = await response.text();

	if (!text) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (undefined as any) as T; // mega oof - twitch doesn't return a response when it should
	}

	return JSON.parse(text);
}
