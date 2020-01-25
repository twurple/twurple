import * as fetchPonyfill from 'fetch-ponyfill';
import * as qs from 'qs';
import AccessToken, { AccessTokenData } from './API/AccessToken';
import BadgesAPI from './API/Badges/BadgesAPI';
import HelixAPIGroup from './API/Helix/HelixAPIGroup';
import { CheermoteBackground, CheermoteScale, CheermoteState } from './API/Kraken/Bits/CheermoteList';

import KrakenAPIGroup from './API/Kraken/KrakenAPIGroup';
import TokenInfo, { TokenInfoData } from './API/TokenInfo';
import UnsupportedAPI from './API/Unsupported/UnsupportedAPI';
import AuthProvider from './Auth/AuthProvider';
import ClientCredentialsAuthProvider from './Auth/ClientCredentialsAuthProvider';
import RefreshableAuthProvider, { RefreshConfig } from './Auth/RefreshableAuthProvider';
import StaticAuthProvider from './Auth/StaticAuthProvider';
import ConfigError from './Errors/ConfigError';
import HTTPStatusCodeError from './Errors/HTTPStatusCodeError';
import { Cacheable, CachedGetter } from './Toolkit/Decorators/Cache';

const { fetch, Headers } = fetchPonyfill();

/**
 * Default configuration for the cheermote API.
 */
export interface TwitchCheermoteConfig {
	/**
	 * The default background type.
	 */
	defaultBackground: CheermoteBackground;

	/**
	 * The default cheermote state.
	 */
	defaultState: CheermoteState;

	/**
	 * The default cheermote scale.
	 */
	defaultScale: CheermoteScale;
}

/**
 * Configuration for a {@TwitchClient} instance.
 */
export interface TwitchConfig {
	/**
	 * An authentication provider that supplies tokens to the client.
	 *
	 * For more information, see the {@AuthProvider} documentation.
	 */
	authProvider: AuthProvider;

	/**
	 * Whether to authenticate the client before a request is made.
	 */
	preAuth: boolean;

	/**
	 * The scopes to request with the initial request, even if it's not necessary for the request.
	 */
	initialScopes?: string[];

	/**
	 * Default values for fetched cheermotes.
	 */
	cheermotes: TwitchCheermoteConfig;
}

/**
 * The endpoint to call, i.e. /kraken, /helix or a custom (potentially unsupported) endpoint.
 */
export enum TwitchAPICallType {
	/**
	 * Call a Kraken API endpoint.
	 */
	Kraken,

	/**
	 * Call a Helix API endpoint.
	 */
	Helix,

	/**
	 * Call an authentication endpoint.
	 */
	Auth,

	/**
	 * Call a custom (potentially unsupported) endpoint.
	 */
	Custom
}

/**
 * Configuration for a single API call.
 */
export interface TwitchAPICallOptions {
	/**
	 * The URL to request.
	 *
	 * If `type` is not `'custom'`, this is relative to the respective API root endpoint. Otherwise, it is an absoulte URL.
	 */
	url: string;

	/**
	 * The endpoint to call, i.e. /kraken, /helix or a custom (potentially unsupported) endpoint.
	 */
	type?: TwitchAPICallType;

	/**
	 * The HTTP method to use. Defaults to `'GET'`.
	 */
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

	/**
	 * The query parameters to send with the API call.
	 */
	query?: Record<string, string | string[] | undefined>;

	/**
	 * The form body to send with the API call.
	 *
	 * If this is given, `jsonBody` will be ignored.
	 */
	body?: Record<string, string | string[] | undefined>;

	/**
	 * The JSON body to send with the API call.
	 *
	 * If `body` is also given, this will be ignored.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	jsonBody?: any;

	/**
	 * The scope the request needs.
	 */
	scope?: string;

	/**
	 * The Kraken API version to request with. Defaults to 5.
	 *
	 * If `type` is not `'kraken'`, this will be ignored.
	 *
	 * Note that v3 will be removed at some point and v5 will be the only Kraken version left, so you should only use this option if you want to rewrite everything in a few months.
	 *
	 * Internally, only v5 and Helix are used.
	 */
	version?: number;
}

/**
 * The main entry point of this library. Manages API calls and the use of access tokens in these.
 */
@Cacheable
export default class TwitchClient {
	/** @private */
	readonly _config: TwitchConfig;

	/**
	 * Creates a new instance with fixed credentials.
	 *
	 * @param clientId The client ID of your application.
	 * @param accessToken The access token to call the API with.
	 *
	 * You need to obtain one using one of the [Twitch OAuth flows](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/).
	 * @param scopes The scopes your supplied token has.
	 *
	 * If this argument is given, the scopes need to be correct, or weird things might happen. If it's not (i.e. it's `undefined`), we fetch the correct scopes for you.
	 *
	 * If you can't exactly say which scopes your token has, don't use this parameter/set it to `undefined`.
	 * @param refreshConfig Configuration to automatically refresh expired tokens.
	 * @param config Additional configuration to pass to the constructor.
	 *
	 * Note that if you provide a custom `authProvider`, this method will overwrite it. In this case, you should use the constructor directly.
	 */
	static async withCredentials(
		clientId: string,
		accessToken?: string,
		scopes?: string[],
		refreshConfig?: RefreshConfig,
		config: Partial<TwitchConfig> = {}
	) {
		let passedAccessToken: string | AccessToken | undefined = accessToken;
		if (!scopes && accessToken) {
			let tokenData = await this.getTokenInfo(clientId, accessToken);
			if (!tokenData.valid) {
				if (refreshConfig) {
					passedAccessToken = await this.refreshAccessToken(
						clientId,
						refreshConfig.clientSecret,
						refreshConfig.refreshToken
					);
					if (refreshConfig.onRefresh) {
						refreshConfig.onRefresh(passedAccessToken);
					}
					tokenData = await this.getTokenInfo(clientId, passedAccessToken.accessToken);
				}
				if (!tokenData.valid) {
					throw new ConfigError('Supplied an invalid access token to retrieve scopes with');
				}
			}
			scopes = tokenData.scopes;
		}
		const authProvider = refreshConfig
			? new RefreshableAuthProvider(new StaticAuthProvider(clientId, passedAccessToken, scopes), refreshConfig)
			: new StaticAuthProvider(clientId, passedAccessToken, scopes);

		return new this({ ...config, authProvider });
	}

	/**
	 * Creates a new instance with client credentials.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 * @param config Additional configuration to pass to the constructor.
	 *
	 * Note that if you provide a custom `authProvider`, this method will overwrite it. In this case, you should use the constructor directly.
	 */
	static withClientCredentials(clientId: string, clientSecret?: string, config: Partial<TwitchConfig> = {}) {
		const authProvider = clientSecret
			? new ClientCredentialsAuthProvider(clientId, clientSecret)
			: new StaticAuthProvider(clientId);

		return new this({ ...config, authProvider });
	}

	/**
	 * Makes a call to the Twitch API using given credetials.
	 *
	 * @param options The configuration of the call.
	 * @param clientId The client ID of your application.
	 * @param accessToken The access token to call the API with.
	 *
	 * You need to obtain one using one of the [Twitch OAuth flows](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/).
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static async callAPI<T = any>(options: TwitchAPICallOptions, clientId?: string, accessToken?: string): Promise<T> {
		const type = options.type === undefined ? TwitchAPICallType.Kraken : options.type;
		const url = this._getUrl(options.url, type);
		const params = qs.stringify(options.query, { arrayFormat: 'repeat' });
		const headers = new Headers({
			Accept:
				type === TwitchAPICallType.Kraken
					? `application/vnd.twitchtv.v${options.version || 5}+json`
					: 'application/json'
		});

		let body: string | undefined;
		if (options.body) {
			body = qs.stringify(options.body);
			headers.append('Content-Type', 'application/x-www-form-urlencoded');
		} else if (options.jsonBody) {
			body = JSON.stringify(options.jsonBody);
			headers.append('Content-Type', 'application/json');
		}

		if (clientId && type !== TwitchAPICallType.Auth) {
			headers.append('Client-ID', clientId);
		}

		if (accessToken) {
			headers.append('Authorization', `${type === TwitchAPICallType.Helix ? 'Bearer' : 'OAuth'} ${accessToken}`);
		}

		const requestOptions: RequestInit = {
			method: options.method || 'GET',
			headers,
			body
		};

		const response = await fetch(params ? `${url}?${params}` : url, requestOptions);

		if (!response.ok) {
			throw new HTTPStatusCodeError(response.status, response.statusText, await response.json());
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

	/**
	 * Retrieves an access token with your client credentials and an authorization code.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 * @param code The authorization code.
	 * @param redirectUri The redirect URI. This serves no real purpose here, but must still match with the redirect URI you configured in the Twitch Developer dashboard.
	 */
	static async getAccessToken(clientId: string, clientSecret: string, code: string, redirectUri: string) {
		return new AccessToken(
			await this.callAPI<AccessTokenData>({
				type: TwitchAPICallType.Auth,
				url: 'token',
				method: 'POST',
				query: {
					grant_type: 'authorization_code',
					client_id: clientId,
					client_secret: clientSecret,
					code,
					redirect_uri: redirectUri
				}
			})
		);
	}

	/**
	 * Retrieves an app access token with your client credentials.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 * @param clientSecret
	 */
	static async getAppAccessToken(clientId: string, clientSecret: string) {
		return new AccessToken(
			await this.callAPI<AccessTokenData>({
				type: TwitchAPICallType.Auth,
				url: 'token',
				method: 'POST',
				query: {
					grant_type: 'client_credentials',
					client_id: clientId,
					client_secret: clientSecret
				}
			})
		);
	}

	/**
	 * Refreshes an expired access token with your client credentials and the refresh token that was given by the initial authentication.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 * @param refreshToken The refresh token.
	 */
	static async refreshAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
		return new AccessToken(
			await this.callAPI<AccessTokenData>({
				type: TwitchAPICallType.Auth,
				url: 'token',
				method: 'POST',
				query: {
					grant_type: 'refresh_token',
					client_id: clientId,
					client_secret: clientSecret,
					refresh_token: refreshToken
				}
			})
		);
	}

	/**
	 * Retrieves information about an access token.
	 *
	 * @param clientId The client ID of your application.
	 * @param accessToken The access token to get the information of.
	 *
	 * You need to obtain one using one of the [Twitch OAuth flows](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/).
	 */
	static async getTokenInfo(clientId: string, accessToken: string) {
		try {
			const data = await this.callAPI<TokenInfoData>(
				{ type: TwitchAPICallType.Auth, url: 'validate' },
				clientId,
				accessToken
			);
			return new TokenInfo(data);
		} catch (e) {
			if (e instanceof HTTPStatusCodeError && e.statusCode === 401) {
				return new TokenInfo();
			}
			throw e;
		}
	}

	/**
	 * Creates a new Twitch client instance.
	 *
	 * @param config Configuration for the client instance.
	 */
	constructor(config: Partial<TwitchConfig>) {
		const { authProvider, ...restConfig } = config;
		if (!authProvider) {
			throw new ConfigError('No auth provider given');
		}

		this._config = {
			preAuth: false,
			cheermotes: {
				defaultBackground: CheermoteBackground.dark,
				defaultState: CheermoteState.animated,
				defaultScale: CheermoteScale.x1
			},
			authProvider,
			...restConfig
		};

		if (this._config.preAuth) {
			// tslint:disable-next-line:no-floating-promises
			authProvider.getAccessToken(this._config.initialScopes);
		}
	}

	/**
	 * Retrieves information about your access token.
	 */
	async getTokenInfo() {
		try {
			const data = await this.callAPI<TokenInfoData>({ type: TwitchAPICallType.Auth, url: 'validate' });
			return new TokenInfo(data);
		} catch (e) {
			if (e instanceof HTTPStatusCodeError && e.statusCode === 401) {
				return new TokenInfo();
			}
			throw e;
		}
	}

	/**
	 * Retrieves an access token for the authentication provider.
	 *
	 * @param scopes The scopes to request.
	 */
	async getAccessToken(scopes?: string | string[]) {
		return this._config.authProvider.getAccessToken(scopes);
	}

	/**
	 * Forces the authentication provider to refresh the access token, if possible.
	 */
	async refreshAccessToken() {
		return this._config.authProvider.refresh && this._config.authProvider.refresh();
	}

	/**
	 * Makes a call to the Twitch API using your access token.
	 *
	 * @param options The configuration of the call.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async callAPI<T = any>(options: TwitchAPICallOptions) {
		const { authProvider } = this._config;
		let accessToken = await authProvider.getAccessToken(options.scope ? [options.scope] : undefined);
		if (!accessToken) {
			return TwitchClient.callAPI<T>(options, authProvider.clientId);
		}

		if (accessToken.isExpired && authProvider.refresh) {
			accessToken = await authProvider.refresh();
		}

		return TwitchClient.callAPI<T>(options, authProvider.clientId, accessToken.accessToken);
	}

	/**
	 * A group of Kraken API methods.
	 */
	@CachedGetter()
	get kraken() {
		return new KrakenAPIGroup(this);
	}

	/**
	 * A group of Helix API methods.
	 */
	@CachedGetter()
	get helix() {
		return new HelixAPIGroup(this);
	}

	/**
	 * The API methods that deal with badges.
	 */
	@CachedGetter()
	get badges() {
		return new BadgesAPI(this);
	}

	/**
	 * Various API methods that are not officially supported by Twitch.
	 */
	@CachedGetter()
	get unsupported() {
		return new UnsupportedAPI(this);
	}

	private static _getUrl(url: string, type: TwitchAPICallType) {
		switch (type) {
			case TwitchAPICallType.Kraken:
			case TwitchAPICallType.Helix:
				const typeName = type === TwitchAPICallType.Kraken ? 'kraken' : 'helix';
				return `https://api.twitch.tv/${typeName}/${url.replace(/^\//, '')}`;
			case TwitchAPICallType.Auth:
				return `https://id.twitch.tv/oauth2/${url.replace(/^\//, '')}`;
			case TwitchAPICallType.Custom:
				return url;
			default:
				return url; // wat
		}
	}
}
