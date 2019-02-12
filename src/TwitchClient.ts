import * as qs from 'qs';
import AuthProvider from './Auth/AuthProvider';
import { Cacheable, CachedGetter } from './Toolkit/Decorators';
import TokenInfo, { TokenInfoData } from './API/TokenInfo';
import { CheermoteBackground, CheermoteScale, CheermoteState } from './API/Bits/CheermoteList';
import AccessToken, { AccessTokenData } from './API/AccessToken';
import StaticAuthProvider from './Auth/StaticAuthProvider';
import RefreshableAuthProvider, { RefreshConfig } from './Auth/RefreshableAuthProvider';
import ClientCredentialsAuthProvider from './Auth/ClientCredentialsAuthProvider';
import ConfigError from './Errors/ConfigError';
import HTTPStatusCodeError from './Errors/HTTPStatusCodeError';

import BitsAPI from './API/Bits/BitsAPI';
import ChannelAPI from './API/Channel/ChannelAPI';
import ChatAPI from './API/Chat/ChatAPI';
import HelixAPIGroup from './API/Helix/HelixAPIGroup';
import SearchAPI from './API/Search/SearchAPI';
import StreamAPI from './API/Stream/StreamAPI';
import UnsupportedAPI from './API/Unsupported/UnsupportedAPI';
import UserAPI from './API/User/UserAPI';

import * as fetchPonyfill from 'fetch-ponyfill';

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
	initialScopes: string[];

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
	// tslint:disable-next-line:no-any
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
	 * Note that v3 will be removed at the end of 2018 and v5 will be the only Kraken version left, so you should only use this option if you want to rewrite everything in a few months.
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
	static async withCredentials(clientId: string, accessToken?: string, scopes?: string[], refreshConfig?: RefreshConfig, config: Partial<TwitchConfig> = {}) {
		if (!scopes && accessToken) {
			const tokenData = await this.getTokenInfo(clientId, accessToken);
			if (!tokenData.valid) {
				throw new ConfigError('Supplied an invalid access token to retrieve scopes with');
			}
			scopes = tokenData.scopes;
		}
		if (refreshConfig) {
			return new this({ ...config, authProvider: new RefreshableAuthProvider(new StaticAuthProvider(clientId, accessToken, scopes), refreshConfig) });
		} else {
			return new this({ ...config, authProvider: new StaticAuthProvider(clientId, accessToken, scopes) });
		}
	}

	/**
	 * Creates a new instance with client credentials.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 * @param accessToken The app access token to set initially.
	 * @param config Additional configuration to pass to the constructor.
	 *
	 * Note that if you provide a custom `authProvider`, this method will overwrite it. In this case, you should use the constructor directly.
	 */
	static withClientCredentials(clientId: string, clientSecret: string, accessToken?: string, config: Partial<TwitchConfig> = {}) {
		return new this({ ...config, authProvider: new ClientCredentialsAuthProvider(clientId, clientSecret) });
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
			initialScopes: [],
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
			authProvider.getAccessToken(this._config.initialScopes || []);
		}
	}

	/**
	 * Retrieves information about your access token.
	 */
	async getTokenInfo() {
		const data = await this.callAPI<TokenInfoData>({ url: '/' });
		return new TokenInfo(data.token);
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
		const data = await this.callAPI<TokenInfoData>({ url: '/' }, clientId, accessToken);
		return new TokenInfo(data.token);
	}

	/**
	 * Retrieves an access token for the authentication provider.
	 *
	 * @param scope
	 */
	async getAccessToken(scope?: string) {
		return this._config.authProvider.getAccessToken(scope);
	}

	/**
	 * Makes a call to the Twitch API using your access token.
	 *
	 * @param options The configuration of the call.
	 */
	// tslint:disable-next-line:no-any
	async callAPI<T = any>(options: TwitchAPICallOptions) {
		const { authProvider } = this._config;
		let accessToken = await authProvider.getAccessToken(options.scope ? [options.scope] : []);
		if (!accessToken) {
			return TwitchClient.callAPI<T>(options, authProvider.clientId);
		}

		if (accessToken.isExpired && authProvider.refresh) {
			accessToken = await authProvider.refresh();
		}

		return TwitchClient.callAPI<T>(options, authProvider.clientId, accessToken.accessToken);
	}

	private static _getUrl(url: string, type?: TwitchAPICallType) {
		type = type === undefined ? TwitchAPICallType.Kraken : type;
		switch (type) {
			case TwitchAPICallType.Kraken:
			case TwitchAPICallType.Helix:
				const typeName = type === TwitchAPICallType.Kraken ? 'kraken' : 'helix';
				return `https://api.twitch.tv/${typeName}/${url.replace(/^\//, '')}`;
			case TwitchAPICallType.Custom:
				return url;
			default:
				return url; // wat
		}
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
	// tslint:disable-next-line:no-any
	static async callAPI<T = any>(options: TwitchAPICallOptions, clientId?: string, accessToken?: string): Promise<T> {
		const url = this._getUrl(options.url, options.type);
		const params = qs.stringify(options.query, { arrayFormat: 'repeat' });
		const headers = new Headers({
			Accept: `application/vnd.twitchtv.v${options.version || 5}+json`
		});

		let body: string | undefined;
		if (options.body) {
			body = qs.stringify(options.body);
		} else if (options.jsonBody) {
			body = JSON.stringify(options.jsonBody);
		}

		if (clientId) {
			headers.append('Client-ID', clientId);
		}

		if (accessToken) {
			headers.append('Authorization', `${options.type === TwitchAPICallType.Helix ? 'Bearer' : 'OAuth'} ${accessToken}`);
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

		return response.json();
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
		return new AccessToken(await this.callAPI<AccessTokenData>({
			url: 'oauth2/token',
			method: 'POST',
			query: {
				grant_type: 'authorization_code',
				client_id: clientId,
				client_secret: clientSecret,
				code,
				redirect_uri: redirectUri
			}
		}));
	}

	/**
	 * Retrieves an app access token with your client credentials.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 * @param clientSecret
	 */
	static async getAppAccessToken(clientId: string, clientSecret: string) {
		return new AccessToken(await this.callAPI<AccessTokenData>({
			url: 'oauth2/token',
			method: 'POST',
			query: {
				grant_type: 'client_credentials',
				client_id: clientId,
				client_secret: clientSecret
			}
		}));
	}

	/**
	 * Refreshes an expired access token with your client credentials and the refresh token that was given by the initial authentication.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 * @param refreshToken The refresh token.
	 */
	static async refreshAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
		return new AccessToken(await this.callAPI<AccessTokenData>({
			url: 'oauth2/token',
			method: 'POST',
			query: {
				grant_type: 'refresh_token',
				client_id: clientId,
				client_secret: clientSecret,
				refresh_token: refreshToken
			}
		}));
	}

	/**
	 * The API methods that deal with bits.
	 */
	@CachedGetter()
	get bits() {
		return new BitsAPI(this);
	}

	/**
	 * The API methods that deal with channels.
	 */
	@CachedGetter()
	get channels() {
		return new ChannelAPI(this);
	}

	/**
	 * The API methods that deal with chat.
	 */

	@CachedGetter()
	get chat() {
		return new ChatAPI(this);
	}

	/**
	 * The API methods that deal with searching.
	 */
	@CachedGetter()
	get search() {
		return new SearchAPI(this);
	}

	/**
	 * The API methods that deal with streams.
	 */
	@CachedGetter()
	get streams() {
		return new StreamAPI(this);
	}

	/**
	 * The API methods that deal with users.
	 */
	@CachedGetter()
	get users() {
		return new UserAPI(this);
	}

	/**
	 * A group of Helix API methods.
	 */
	@CachedGetter()
	get helix() {
		return new HelixAPIGroup(this);
	}

	/**
	 * Different API methods that are not officially supported by Twitch.
	 */
	@CachedGetter()
	get unsupported() {
		return new UnsupportedAPI(this);
	}
}
