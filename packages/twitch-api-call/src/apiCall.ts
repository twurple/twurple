/// <reference lib="dom" />

import fetch, { Headers } from '@d-fischer/cross-fetch';
import { stringify } from '@d-fischer/qs';
import { transformTwitchApiResponse } from './helpers/transform';
import { getTwitchApiUrl } from './helpers/url';
import type { TwitchApiCallOptions } from './TwitchApiCallOptions';
import { TwitchApiCallType } from './TwitchApiCallOptions';

/**
 * Makes a call to the Twitch API using the given credentials, returning the raw Response object.
 *
 * @param options
 * @param clientId
 * @param accessToken
 */
export async function callTwitchApiRaw(
	options: TwitchApiCallOptions,
	clientId?: string,
	accessToken?: string
): Promise<Response> {
	const type = options.type === undefined ? TwitchApiCallType.Kraken : options.type;
	const url = getTwitchApiUrl(options.url, type);
	const params = stringify(options.query, { arrayFormat: 'repeat' });
	const headers = new Headers({
		Accept: type === TwitchApiCallType.Kraken ? 'application/vnd.twitchtv.v5+json' : 'application/json'
	});

	let body: string | undefined;
	if (options.body) {
		body = stringify(options.body);
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
	} else if (options.jsonBody) {
		body = JSON.stringify(options.jsonBody);
		headers.append('Content-Type', 'application/json');
	}

	if (clientId && type !== TwitchApiCallType.Auth) {
		headers.append('Client-ID', clientId);
	}

	if (accessToken) {
		headers.append('Authorization', `${type === TwitchApiCallType.Helix ? 'Bearer' : 'OAuth'} ${accessToken}`);
	}

	const requestOptions: RequestInit = {
		method: options.method || 'GET',
		headers,
		body
	};

	return fetch(params ? `${url}?${params}` : url, requestOptions);
}

/**
 * Makes a call to the Twitch API using given credentials.
 *
 * @param options The configuration of the call.
 * @param clientId The client ID of your application.
 * @param accessToken The access token to call the API with.
 *
 * You need to obtain one using one of the [Twitch OAuth flows](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function callTwitchApi<T = any>(
	options: TwitchApiCallOptions,
	clientId?: string,
	accessToken?: string
): Promise<T> {
	const response = await callTwitchApiRaw(options, clientId, accessToken);

	return transformTwitchApiResponse(response);
}
