import AuthProvider from './Auth/AuthProvider';
import * as defaults from 'defaults';
import * as request from 'request-promise-native';
import { Cacheable, Cached, CachedGetter } from './Toolkit/Decorators';
import TokenInfo, { TokenInfoData } from './API/TokenInfo';
import { CheermoteBackground, CheermoteScale, CheermoteState } from './API/Bits/CheermoteList';
import { UniformObject } from './Toolkit/ObjectTools';

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

		let requestOptions: request.Options = {
			url: `https://api.twitch.tv/kraken/${options.url.replace(/^\//, '')}`,
			method: options.method,
			headers: {
				'Client-ID': this._config.authProvider.clientId,
				Authorization: `OAuth ${authToken}`,
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

		return request(requestOptions);
	}

	public async getChatClient(identifier: string = 'default') {
		if (!this._chatClients.has(identifier)) {
			const token = await this._config.authProvider.getAuthToken(['chat_login']);
			const tokenInfo = await this.getTokenInfo();
			if (tokenInfo.valid && tokenInfo.userName) {
				const newClient = new ChatClient(tokenInfo.userName, token);
				this._chatClients.set(identifier, newClient);
				return newClient;
			}

			throw new Error('invalid token when trying to connect to chat');
		}

		return this._chatClients.get(identifier);
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
