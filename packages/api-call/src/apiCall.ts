/// <reference lib="dom" />

import fetch, { Headers } from '@d-fischer/cross-fetch';
import { stringify } from '@d-fischer/qs';
import { HttpStatusCodeError } from './errors/HttpStatusCodeError';
import { transformTwitchApiResponse } from './helpers/transform';
import { getTwitchApiUrl } from './helpers/url';
import type { TwitchApiCallFetchOptions, TwitchApiCallOptions } from './TwitchApiCallOptions';

/**
 * Makes a call to the Twitch API using the given credentials, returning the raw Response object.
 *
 * @param options The configuration of the call.
 * @param clientId The client ID of your application.
 * @param accessToken The access token to call the API with.
 *
 * You need to obtain one using one of the [Twitch OAuth flows](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/).
 * @param authorizationType The type of Authorization header to send.
 *
 * Defaults to "Bearer" for Helix and "OAuth" for everything else.
 * @param fetchOptions Additional options to be passed to the `fetch` function.
 */
export async function callTwitchApiRaw(
	options: TwitchApiCallOptions,
	clientId?: string,
	accessToken?: string,
	authorizationType?: string,
	fetchOptions: TwitchApiCallFetchOptions = {}
): Promise<Response> {
	const type = options.type ?? 'helix';
	const url = getTwitchApiUrl(options.url, type);
	const params = stringify(options.query, { arrayFormat: 'repeat', addQueryPrefix: true });
	const headers = new Headers({ Accept: 'application/json' });

	let body: string | undefined = undefined;
	if (options.jsonBody) {
		body = JSON.stringify(options.jsonBody);
		headers.append('Content-Type', 'application/json');
	}

	if (clientId && type !== 'auth') {
		headers.append('Client-ID', clientId);
	}

	if (accessToken) {
		headers.append('Authorization', `${type === 'helix' ? authorizationType ?? 'Bearer' : 'OAuth'} ${accessToken}`);
	}

	const requestOptions: RequestInit = {
		...(fetchOptions as RequestInit),
		method: options.method ?? 'GET',
		headers,
		body
	};

	return await fetch(`${url}${params}`, requestOptions);
}

/**
 * Makes a call to the Twitch API using given credentials.
 *
 * @param options The configuration of the call.
 * @param clientId The client ID of your application.
 * @param accessToken The access token to call the API with.
 *
 * You need to obtain one using one of the [Twitch OAuth flows](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/).
 * @param authorizationType The type of Authorization header to send.
 *
 * Defaults to "Bearer" for Helix and "OAuth" for everything else.
 * @param fetchOptions Additional options to be passed to the `fetch` function.
 */
export async function callTwitchApi<T = unknown>(
	options: TwitchApiCallOptions,
	clientId?: string,
	accessToken?: string,
	authorizationType?: string,
	fetchOptions: TwitchApiCallFetchOptions = {}
): Promise<T> {
	const response = await callTwitchApiRaw(options, clientId, accessToken, authorizationType, fetchOptions);

	if (!response.ok) {
		const isJson = response.headers.get('Content-Type') === 'application/json';
		const text = isJson ? JSON.stringify(await response.json(), null, 2) : await response.text();
		const params = stringify(options.query, { arrayFormat: 'repeat', addQueryPrefix: true });
		const fullUrl = `${options.url}${params}`;
		throw new HttpStatusCodeError(
			response.status,
			response.statusText,
			fullUrl,
			options.method ?? 'GET',
			text,
			isJson
		);
	}

	return await transformTwitchApiResponse<T>(response);
}
