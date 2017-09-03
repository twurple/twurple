import AuthProvider from './Auth/AuthProvider';
import * as defaults from 'defaults';
import * as request from 'request-promise-native';
import { Cacheable, Cached, CachedGetter } from './Toolkit/Decorators';
import TokenInfo, { TokenInfoData } from './API/TokenInfo';
import { CheermoteBackground, CheermoteScale, CheermoteState } from './API/Bits/CheermoteList';
import { UniformObject } from './Toolkit/ObjectTools';
import StaticAuthProvider from './Auth/StaticAuthProvider';

import BitsAPI from './API/Bits/BitsAPI';
import ChannelAPI from './API/Channel/ChannelAPI';
import SearchAPI from './API/Search/SearchAPI';
import StreamAPI from './API/Stream/StreamAPI';
import UserAPI from './API/User/UserAPI';
import ChatClient from './Chat/ChatClient';

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

export interface TwitchApiCallOptions {
	url: string;
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	query?: UniformObject<string>;
	body?: UniformObject<string>;
	// tslint:disable-next-line:no-any
	jsonBody?: any;
	scope?: string;
	version?: number;
}

export interface TwitchAccessTokenData {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	scope: string;
}

@Cacheable
export default class Twitch {
	readonly _config: TwitchConfig;
	private _chatClients: Map<string, ChatClient> = new Map;

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
			this._config.authProvider.getAuthToken(this._config.initialScopes || []);
		}
	}

	@Cached(3600)
	public async getTokenInfo() {
		const data: TokenInfoData = await this.apiCall({url: '/'});
		return new TokenInfo(data.token, this);
	}

	// tslint:disable-next-line:no-any
	public async apiCall<T = any>(options: TwitchApiCallOptions): Promise<T> {
		const authToken = await this._config.authProvider.getAuthToken(options.scope ? [options.scope] : []);
		return Twitch.apiCall<T>(options, this._config.authProvider.clientId, authToken);
	}

	// tslint:disable-next-line:no-any
	public static async apiCall<T = any>(options: TwitchApiCallOptions, clientId?: string, authToken?: string): Promise<T> {
		let requestOptions: request.Options = {
			url: `https://api.twitch.tv/kraken/${options.url.replace(/^\//, '')}`,
			method: options.method,
			headers: {
				Accept: `application/vnd.twitchtv.v${options.version || 5}+json`
			},
			qs: options.query,
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

		if (authToken) {
			requestOptions.headers!.Authorization = `OAuth ${authToken}`;
		}

		return request(requestOptions);
	}

	public async getChatClient(identifier: string = 'default') {
		if (!this._chatClients.has(identifier)) {
			const token = await this._config.authProvider.getAuthToken(['chat_login']);
			const tokenInfo = await this.getTokenInfo();
			if (tokenInfo.valid && tokenInfo.userName) {
				const newClient = new ChatClient(tokenInfo.userName, token, this);
				this._chatClients.set(identifier, newClient);
				return newClient;
			}

			throw new Error('invalid token when trying to connect to chat');
		}

		return this._chatClients.get(identifier);
	}

	public static async getAccessToken(clientId: string, clientSecret: string, code: string, redirectUri: string): Promise<TwitchAccessTokenData> {
		return this.apiCall<TwitchAccessTokenData>({
			url: 'oauth2/token',
			method: 'POST',
			query: {
				grant_type: 'authorization_code',
				client_id: clientId,
				client_secret: clientSecret,
				code: code
			}
		});
	}

	public static async refreshAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<TwitchAccessTokenData> {
		return this.apiCall<TwitchAccessTokenData>({
			url: 'oauth2/token',
			method: 'POST',
			query: {
				grant_type: 'refresh_token',
				client_id: clientId,
				client_secret: clientSecret,
				refresh_token: refreshToken
			}
		});
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
}

export { AuthProvider, StaticAuthProvider };
