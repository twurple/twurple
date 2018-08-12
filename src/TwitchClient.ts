import AuthProvider from './Auth/AuthProvider';
import * as defaults from 'defaults';
import * as request from 'request-promise-native';
import { Cacheable, CachedGetter } from './Toolkit/Decorators';
import TokenInfo, { TokenInfoData } from './API/TokenInfo';
import { CheermoteBackground, CheermoteScale, CheermoteState } from './API/Bits/CheermoteList';
import { UniformObject } from './Toolkit/ObjectTools';
import StaticAuthProvider from './Auth/StaticAuthProvider';

import BitsAPI from './API/Bits/BitsAPI';
import ChannelAPI from './API/Channel/ChannelAPI';
import HelixAPIGroup from './API/Helix/HelixAPIGroup';
import SearchAPI from './API/Search/SearchAPI';
import StreamAPI from './API/Stream/StreamAPI';
import UnsupportedAPI from './API/Unsupported/UnsupportedAPI';
import UserAPI from './API/User/UserAPI';

import ChatClient from './Chat/ChatClient';
import AccessToken, { AccessTokenData } from './API/AccessToken';
import RefreshableAuthProvider, { RefreshConfig } from './Auth/RefreshableAuthProvider';
import SingleUserPubSubClient from './PubSub/SingleUserPubSubClient';

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

	/** @private */
	debugLevel: number;
}

/**
 * The endpoint to call, i.e. /kraken, /helix or a custom (potentially unsupported) endpoint.
 */
export enum TwitchApiCallType {
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
export interface TwitchApiCallOptions {
	/**
	 * The URL to request.
	 *
	 * If `type` is not `'custom'`, this is relative to the respective API root endpoint. Otherwise, it is an absoulte URL.
	 */
	url: string;

	/**
	 * The endpoint to call, i.e. /kraken, /helix or a custom (potentially unsupported) endpoint.
	 */
	type?: TwitchApiCallType;

	/**
	 * The HTTP method to use. Defaults to `'GET'`.
	 */
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

	/**
	 * The query parameters to send with the API call.
	 */
	query?: UniformObject<string | string[] | undefined>;

	/**
	 * The form body to send with the API call.
	 *
	 * If this is given, `jsonBody` will be ignored.
	 */
	body?: UniformObject<string | string[] | undefined>;

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
 * The main entry point of this library. Manages API calls, chat and PubSub connections and the use of access token in all of these.
 */
@Cacheable
export default class TwitchClient {
	/** @private */
	readonly _config: TwitchConfig;
	private readonly _chatClients: Map<string, ChatClient> = new Map;
	private readonly _pubSubClients: Map<string, SingleUserPubSubClient> = new Map;

	/**
	 * Creates a new instance with fixed credentials.
	 *
	 * @param clientId The client ID of your application.
	 * @param accessToken The access token to do API requests with.
	 * @param refreshConfig Configuration to automatically refresh expired tokens.
	 * @param config Additional configuration to pass to the constructor.
	 *
	 * Note that if you provide a custom authentication provider, this method will overwrite it. In this case, you should use the constructor directly.
	 */
	public static withCredentials(clientId: string, accessToken?: string, refreshConfig?: RefreshConfig, config: Partial<TwitchConfig> = {}) {
		if (refreshConfig) {
			return new this({ ...config, authProvider: new RefreshableAuthProvider(new StaticAuthProvider(clientId, accessToken), refreshConfig) });
		} else {
			return new this({ ...config, authProvider: new StaticAuthProvider(clientId, accessToken) });
		}
	}

	/**
	 * Creates a new Twitch client instance.
	 *
	 * @param config Configuration for the client instance.
	 */
	public constructor(config: Partial<TwitchConfig>) {
		if (!config.authProvider) {
			throw new Error('No auth provider given');
		}

		this._config = defaults(config, {
			preAuth: false,
			initialScopes: [],
			cheermotes: {
				defaultBackground: CheermoteBackground.dark,
				defaultState: CheermoteState.animated,
				defaultScale: CheermoteScale.x1
			},
			debugLevel: 0
		});

		if (this._config.preAuth) {
			// tslint:disable-next-line:no-floating-promises
			this._config.authProvider.getAccessToken(this._config.initialScopes || []);
		}
	}

	/**
	 * Retrieves information about your access token.
	 */
	public async getTokenInfo() {
		const data = await this.apiCall<TokenInfoData>({ url: '/' });
		return new TokenInfo(data.token);
	}

	/**
	 * Retrieves information about an access token.
	 *
	 * @param clientId The client ID of your application.
	 * @param accessToken The access token.
	 */
	public static async getTokenInfo(clientId: string, accessToken: string) {
		const data = await this.apiCall<TokenInfoData>({ url: '/' }, clientId, accessToken);
		return new TokenInfo(data.token);
	}

	/**
	 * Makes a call to the Twitch API using your access token.
	 *
	 * @param options The configuration of the call.
	 */
	// tslint:disable-next-line:no-any
	public async apiCall<T = any>(options: TwitchApiCallOptions): Promise<T> {
		let accessToken = await this._config.authProvider.getAccessToken(options.scope ? [options.scope] : []);
		try {
			return await TwitchClient.apiCall<T>(options, this._config.authProvider.clientId, accessToken);
		} catch (e) {
			if (e.response && e.response.status === 401 && this._config.authProvider instanceof RefreshableAuthProvider) {
				await this._config.authProvider.refresh();
				accessToken = await this._config.authProvider.getAccessToken(options.scope ? [options.scope] : []);
				return TwitchClient.apiCall<T>(options, this._config.authProvider.clientId, accessToken);
			}

			throw e;
		}
	}

	private static _getUrl(url: string, type?: TwitchApiCallType) {
		type = type === undefined ? TwitchApiCallType.Kraken : type;
		switch (type) {
			case TwitchApiCallType.Kraken:
			case TwitchApiCallType.Helix:
				const typeName = type === TwitchApiCallType.Kraken ? 'kraken' : 'helix';
				return `https://api.twitch.tv/${typeName}/${url.replace(/^\//, '')}`;
			case TwitchApiCallType.Custom:
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
	 * @param accessToken The access token.
	 */
	// tslint:disable-next-line:no-any
	public static async apiCall<T = any>(options: TwitchApiCallOptions, clientId?: string, accessToken?: string): Promise<T> {
		const requestOptions: request.Options = {
			url: this._getUrl(options.url, options.type),
			method: options.method,
			headers: {
				Accept: `application/vnd.twitchtv.v${options.version || 5}+json`
			},
			qs: options.query,
			qsStringifyOptions: {
				arrayFormat: 'repeat'
			},
			json: true,
			gzip: true
		};

		if (options.body) {
			requestOptions.form = options.body;
		} else if (options.jsonBody) {
			requestOptions.body = options.jsonBody;
		}

		if (clientId) {
			requestOptions.headers!['Client-ID'] = clientId;
		}

		if (accessToken) {
			requestOptions.headers!.Authorization = `${options.type === TwitchApiCallType.Helix ? 'Bearer' : 'OAuth'} ${accessToken}`;
		}

		return request(requestOptions);
	}

	/**
	 * Creates a chat client with your credentials.
	 *
	 * @param identifier The identifier of the chat client.
	 *
	 * Passing different strings to this will create separate clients. Passing the same string twice will return the same client.
	 */
	public async getChatClient(identifier: string = 'default') {
		if (!this._chatClients.has(identifier)) {
			const token = await this._config.authProvider.getAccessToken(['chat_login']);
			const tokenInfo = await this.getTokenInfo();
			if (tokenInfo.valid && tokenInfo.userName) {
				const newClient = new ChatClient(tokenInfo.userName, token, this);
				this._chatClients.set(identifier, newClient);
				return newClient;
			}

			throw new Error('invalid token when trying to connect to chat');
		}

		return this._chatClients.get(identifier)!;
	}

	/**
	 * Creates a PubSub client with your credentials.
	 *
	 * @param identifier The identifier of the PubSub client.
	 *
	 * Passing different strings to this will create separate clients. Passing the same string twice will return the same client.
	 */
	public getPubSubClient(identifier: string = 'default') {
		if (!this._pubSubClients.has(identifier)) {
			const newClient = new SingleUserPubSubClient(this);
			this._pubSubClients.set(identifier, newClient);
			return newClient;
		}

		return this._pubSubClients.get(identifier)!;
	}

	/**
	 * Retrieves an access token with your client credentials and an authorization code.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 * @param code The authorization code.
	 * @param redirectUri The redirect URI. This serves no real purpose here, but must still match with the redirect URI you configured in the Twitch Developer dashboard.
	 */
	public static async getAccessToken(clientId: string, clientSecret: string, code: string, redirectUri: string): Promise<AccessToken> {
		return new AccessToken(await this.apiCall<AccessTokenData>({
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
	 * Refreshes an expired access token with your client credentials and the refresh token that was given by the initial authentication.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 * @param refreshToken The refresh token.
	 */
	public static async refreshAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<AccessToken> {
		return new AccessToken(await this.apiCall<AccessTokenData>({
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
