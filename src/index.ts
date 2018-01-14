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

export interface TwitchCheermoteConfig {
	defaultBackground: CheermoteBackground;
	defaultState: CheermoteState;
	defaultScale: CheermoteScale;
}

export interface TwitchConfig {
	authProvider: AuthProvider;
	preAuth: boolean;
	initialScopes: string[];
	cheermotes: TwitchCheermoteConfig;
}

export type TwitchApiCallType = 'kraken' | 'helix' | 'custom';

export interface TwitchApiCallOptions {
	url: string;
	type?: TwitchApiCallType;
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	query?: UniformObject<string | string[] | undefined>;
	body?: UniformObject<string | string[] | undefined>;
	// tslint:disable-next-line:no-any
	jsonBody?: any;
	scope?: string;
	version?: number;
}

@Cacheable
export default class Twitch {
	readonly _config: TwitchConfig;
	private _chatClients: Map<string, ChatClient> = new Map;

	public static withCredentials(clientId: string, accessToken?: string, refreshConfig?: RefreshConfig, config: Partial<TwitchConfig> = {}) {
		if (refreshConfig) {
			return new this({ ...config, authProvider: new RefreshableAuthProvider(new StaticAuthProvider(clientId, accessToken), refreshConfig) });
		} else {
			return new this({ ...config, authProvider: new StaticAuthProvider(clientId, accessToken) });
		}
	}

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
			}
		});

		if (this._config.preAuth) {
			// noinspection JSIgnoredPromiseFromCall
			this._config.authProvider.getAccessToken(this._config.initialScopes || []);
		}
	}

	public async getTokenInfo() {
		const data = await this.apiCall<TokenInfoData>({ url: '/' });
		return new TokenInfo(data.token);
	}

	public static async getTokenInfo(clientId: string, accessToken: string) {
		const data = await this.apiCall<TokenInfoData>({ url: '/' }, clientId, accessToken);
		return new TokenInfo(data.token);
	}

	// tslint:disable-next-line:no-any
	public async apiCall<T = any>(options: TwitchApiCallOptions): Promise<T> {
		let accessToken = await this._config.authProvider.getAccessToken(options.scope ? [options.scope] : []);
		try {
			return await Twitch.apiCall<T>(options, this._config.authProvider.clientId, accessToken);
		} catch (e) {
			if (e.response && e.response.status === 401 && this._config.authProvider instanceof RefreshableAuthProvider) {
				await this._config.authProvider.refresh();
				accessToken = await this._config.authProvider.getAccessToken(options.scope ? [options.scope] : []);
				return await Twitch.apiCall<T>(options, this._config.authProvider.clientId, accessToken);
			}

			throw e;
		}
	}

	private static _getUrl(url: string, type?: TwitchApiCallType) {
		type = type || 'kraken';
		switch (type) {
			case 'kraken':
			case 'helix':
				return `https://api.twitch.tv/${type}/${url.replace(/^\//, '')}`;
			case 'custom':
				return url;
			default:
				return url; // wat
		}
	}

	// tslint:disable-next-line:no-any
	public static async apiCall<T = any>(options: TwitchApiCallOptions, clientId?: string, accessToken?: string): Promise<T> {
		let requestOptions: request.Options = {
			url: this._getUrl(options.url, options.type),
			method: options.method,
			headers: {
				Accept: `application/vnd.twitchtv.v${options.version || 5}+json`
			},
			qs: options.query,
			qsStringifyOptions: {
				arrayFormat: 'repeat'
			},
			form: options.body,
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
			requestOptions.headers!.Authorization = `OAuth ${accessToken}`;
		}

		return request(requestOptions);
	}

	public async getChatClient(identifier: string = 'default', debugLevel: number = 0) {
		if (!this._chatClients.has(identifier)) {
			const token = await this._config.authProvider.getAccessToken(['chat_login']);
			const tokenInfo = await this.getTokenInfo();
			if (tokenInfo.valid && tokenInfo.userName) {
				const newClient = new ChatClient(tokenInfo.userName, token, this, debugLevel);
				this._chatClients.set(identifier, newClient);
				return newClient;
			}

			throw new Error('invalid token when trying to connect to chat');
		}

		return this._chatClients.get(identifier)!;
	}

	public static async getAccessToken(clientId: string, clientSecret: string, code: string, redirectUri: string): Promise<AccessToken> {
		return new AccessToken(await this.apiCall<AccessTokenData>({
			url: 'oauth2/token',
			method: 'POST',
			query: {
				grant_type: 'authorization_code',
				client_id: clientId,
				client_secret: clientSecret,
				code: code,
				redirect_uri: redirectUri
			}
		}));
	}

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

	@CachedGetter()
	get bits() {
		return new BitsAPI(this);
	}

	@CachedGetter()
	get channels() {
		return new ChannelAPI(this);
	}

	@CachedGetter()
	get search() {
		return new SearchAPI(this);
	}

	@CachedGetter()
	get streams() {
		return new StreamAPI(this);
	}

	@CachedGetter()
	get users() {
		return new UserAPI(this);
	}

	@CachedGetter()
	get helix() {
		return new HelixAPIGroup(this);
	}

	@CachedGetter()
	get unsupported() {
		return new UnsupportedAPI(this);
	}
}

export { AuthProvider, StaticAuthProvider, RefreshableAuthProvider };
export { ChatClient };
