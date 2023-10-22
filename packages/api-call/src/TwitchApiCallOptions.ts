/**
 * The endpoint to call, i.e. /helix or a custom (potentially unsupported) endpoint.
 */
export type TwitchApiCallType = 'helix' | 'auth' | 'custom';

/**
 * Configuration for a single API call.
 */
export interface TwitchApiCallOptions {
	/**
	 * The URL to request.
	 *
	 * If `type` is not `'custom'`, this is relative to the respective API root endpoint. Otherwise, it is an absoulte URL.
	 */
	url: string;

	/**
	 * The endpoint to call, i.e. /helix or a custom (potentially unsupported) endpoint.
	 */
	type?: TwitchApiCallType;

	/**
	 * The HTTP method to use. Defaults to `'GET'`.
	 */
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

	/**
	 * The query parameters to send with the API call.
	 */
	query?: Record<string, string | string[] | undefined>;

	/**
	 * The JSON body to send with the API call.
	 *
	 * If `body` is also given, this will be ignored.
	 */
	jsonBody?: unknown;

	/**
	 * The list of scopes that can be used by the request.
	 */
	scopes?: string[];

	/**
	 * Whether OAuth credentials should be generated and sent with the request. Defaults to `true`.
	 */
	auth?: boolean;
}

/**
 * An interface to merge compatible fetch options into.
 *
 * :::warning
 *
 * You should make sure that this does not include the properties `headers`, `method` or `body`
 * in order to not conflict with the internally used properties.
 *
 * :::
 *
 * To make use of the web fetch options, merge them into this like so
 * (assuming that RequestInit is the global type from the dom lib):
 *
 * ```ts
 * declare module '@twurple/api-call' {
 *     export interface TwitchApiCallFetchOptions extends Omit<RequestInit, 'headers' | 'method' | 'body'> {}
 * }
 * ```
 *
 * To make use of the node-fetch options, merge them into this like so:
 *
 * ```ts
 * import type { RequestInit as NodeRequestInit } from 'node-fetch';
 *
 * declare module '@twurple/api-call' {
 *     export interface TwitchApiCallFetchOptions extends Omit<NodeRequestInit, 'headers' | 'method' | 'body'> {}
 * }
 * ```
 */
export interface TwitchApiCallFetchOptions {
	/** @private */ _dummy?: never;
}
