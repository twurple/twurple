import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import deprecate from '@d-fischer/deprecate';
import { LogLevel } from '@d-fischer/logger';
import {
	callTwitchApi,
	callTwitchApiRaw,
	HttpStatusCodeError,
	transformTwitchApiResponse,
	TwitchApiCallOptions,
	TwitchApiCallType
} from 'twitch-api-call';

import {
	AccessToken,
	AuthProvider,
	AuthProviderTokenType,
	ClientCredentialsAuthProvider,
	exchangeCode,
	getAppToken,
	getTokenInfo,
	InvalidTokenError,
	RefreshableAuthProvider,
	RefreshConfig,
	refreshUserToken,
	StaticAuthProvider,
	TokenInfo,
	TokenInfoData
} from 'twitch-auth';

import { BadgesApi } from './API/Badges/BadgesApi';
import { HelixApiGroup } from './API/Helix/HelixApiGroup';
import { HelixRateLimiter } from './API/Helix/HelixRateLimiter';
import { CheermoteBackground, CheermoteScale, CheermoteState } from './API/Kraken/Bits/CheermoteList';
import { KrakenApiGroup } from './API/Kraken/KrakenApiGroup';
import { UnsupportedApi } from './API/Unsupported/UnsupportedApi';

import { ConfigError } from './Errors/ConfigError';

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
 * Configuration for an {@ApiClient} instance.
 */
export interface ApiConfig {
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

	/**
	 * The minimum level of log levels to see. Defaults to critical errors.
	 */
	logLevel?: LogLevel;
}

/**
 * @private
 */
export interface TwitchApiCallOptionsInternal {
	options: TwitchApiCallOptions;
	clientId?: string;
	accessToken?: string;
}

/**
 * The main entry point of this library. Manages API calls and the use of access tokens in these.
 */
@Cacheable
export class ApiClient implements AuthProvider {
	private readonly _config: ApiConfig;
	private readonly _helixRateLimiter: HelixRateLimiter;

	/**
	 * Creates a new instance with fixed credentials.
	 *
	 * @deprecated Use the constructor of {@StaticAuthProvider} or {@RefreshableAuthProvider} and pass it as `authProvider` option to this class' constructor instead.
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
	 * @param tokenType The type of token you passed.
	 *
	 * This should almost always be 'user' (which is the default).
	 *
	 * If you're passing 'app' here, please consider using {@ApiClient.withClientCredentials} instead.
	 */
	static withCredentials(
		clientId: string,
		accessToken?: string,
		scopes?: string[],
		refreshConfig?: RefreshConfig,
		config: Partial<ApiConfig> = {},
		tokenType: AuthProviderTokenType = 'user'
	) {
		const authProvider = refreshConfig
			? new RefreshableAuthProvider(
					new StaticAuthProvider(clientId, accessToken, scopes, tokenType),
					refreshConfig
			  )
			: new StaticAuthProvider(clientId, accessToken, scopes, tokenType);

		return new this({ ...config, authProvider });
	}

	/**
	 * Creates a new instance with client credentials.
	 *
	 * @deprecated Use the constructor of {@ClientCredentialsAuthProvider} and pass it as `authProvider` option to this class' constructor instead.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 * @param config Additional configuration to pass to the constructor.
	 */
	static withClientCredentials(clientId: string, clientSecret?: string, config: Partial<ApiConfig> = {}) {
		const authProvider = clientSecret
			? new ClientCredentialsAuthProvider(clientId, clientSecret)
			: new StaticAuthProvider(clientId);

		return new this({ ...config, authProvider });
	}

	/**
	 * Makes a call to the Twitch API using given credentials.
	 *
	 * @deprecated Use `callTwitchApi` from `twitch-api-call` instead.
	 *
	 * @param options The configuration of the call.
	 * @param clientId The client ID of your application.
	 * @param accessToken The access token to call the API with.
	 *
	 * You need to obtain one using one of the [Twitch OAuth flows](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/).
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static async callApi<T = any>(options: TwitchApiCallOptions, clientId?: string, accessToken?: string): Promise<T> {
		return callTwitchApi(options, clientId, accessToken);
	}

	/**
	 * Makes a call to the Twitch API using given credentials.
	 *
	 * @deprecated Use `callTwitchApi` from `twitch-api-call` instead.
	 *
	 * @param options The configuration of the call.
	 * @param clientId The client ID of your application.
	 * @param accessToken The access token to call the API with.
	 *
	 * You need to obtain one using one of the [Twitch OAuth flows](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/).
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-explicit-any
	static async callAPI<T = any>(options: TwitchApiCallOptions, clientId?: string, accessToken?: string): Promise<T> {
		deprecate('[twitch] ChatClient.callAPI', 'Use callApi instead.');
		return this.callApi<T>(options, clientId, accessToken);
	}

	/**
	 * Retrieves an access token with your client credentials and an authorization code.
	 *
	 * @deprecated Use `exchangeCode` from `twitch-auth` instead.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 * @param code The authorization code.
	 * @param redirectUri The redirect URI. This serves no real purpose here, but must still match with the redirect URI you configured in the Twitch Developer dashboard.
	 */
	static async getAccessToken(clientId: string, clientSecret: string, code: string, redirectUri: string) {
		return exchangeCode(clientId, clientSecret, code, redirectUri);
	}

	/**
	 * Retrieves an app access token with your client credentials.
	 *
	 * @deprecated Use `getAppToken` from `twitch-auth` instead.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 * @param clientSecret
	 */
	static async getAppAccessToken(clientId: string, clientSecret: string) {
		return getAppToken(clientId, clientSecret);
	}

	/**
	 * Refreshes an expired access token with your client credentials and the refresh token that was given by the initial authentication.
	 *
	 * @deprecated Use `refreshUserToken` from `twitch-auth` instead.
	 *
	 * @param clientId The client ID of your application.
	 * @param clientSecret The client secret of your application.
	 * @param refreshToken The refresh token.
	 */
	static async refreshAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
		return refreshUserToken(clientId, clientSecret, refreshToken);
	}

	/**
	 * Retrieves information about an access token.
	 *
	 * @deprecated Use `getTokenInfo` from `twitch-auth` instead.
	 *
	 * @param clientId The client ID of your application.
	 * @param accessToken The access token to get the information of.
	 *
	 * You need to obtain one using one of the [Twitch OAuth flows](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/).
	 */
	static async getTokenInfo(accessToken: string, clientId?: string) {
		return getTokenInfo(accessToken, clientId);
	}

	/**
	 * Creates a new API client instance.
	 *
	 * @param config Configuration for the client instance.
	 */
	constructor(config: Partial<ApiConfig>) {
		const { authProvider, ...restConfig } = config;
		if (!authProvider) {
			throw new ConfigError('No auth provider given');
		}

		this._helixRateLimiter = new HelixRateLimiter(config.logLevel || LogLevel.CRITICAL);

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
			const data = await this.callApi<TokenInfoData>({ type: TwitchApiCallType.Auth, url: 'validate' });
			return new TokenInfo(data);
		} catch (e) {
			if (e instanceof HttpStatusCodeError && e.statusCode === 401) {
				throw new InvalidTokenError();
			}
			throw e;
		}
	}

	/**
	 * Retrieves an access token for the authentication provider.
	 *
	 * @param scopes The scopes to request.
	 *
	 * @deprecated Use {@AuthProvider#getAccessToken} directly instead.
	 */
	async getAccessToken(scopes?: string | string[]) {
		return this._config.authProvider.getAccessToken(scopes);
	}

	/**
	 * The scopes that are currently available using the access token.
	 *
	 * @deprecated Use {@AuthProvider#currentScopes} directly instead.
	 */
	get currentScopes() {
		return this._config.authProvider.currentScopes;
	}

	/** @private */
	setAccessToken(token: AccessToken) {
		this._config.authProvider.setAccessToken(token);
	}

	/**
	 * Forces the authentication provider to refresh the access token, if possible.
	 *
	 * @deprecated Use {@AuthProvider#refresh} directly instead.
	 */
	async refresh() {
		return this._config.authProvider.refresh?.() ?? null;
	}

	/**
	 * Forces the authentication provider to refresh the access token, if possible.
	 *
	 * @deprecated Use {@AuthProvider#refresh} directly instead.
	 */
	async refreshAccessToken() {
		return (await this.refresh()) ?? undefined;
	}

	/**
	 * The type of token used by the client.
	 */
	get tokenType(): AuthProviderTokenType {
		return this._config.authProvider.tokenType || 'user';
	}

	/**
	 * The client ID of your application.
	 */
	get clientId() {
		return this._config.authProvider.clientId;
	}

	/**
	 * Makes a call to the Twitch API using your access token.
	 *
	 * @param options The configuration of the call.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async callApi<T = any>(options: TwitchApiCallOptions) {
		const { authProvider } = this._config;
		let accessToken = await authProvider.getAccessToken(options.scope ? [options.scope] : undefined);
		if (!accessToken) {
			return callTwitchApi<T>(options, authProvider.clientId);
		}

		if (accessToken.isExpired && authProvider.refresh) {
			const newAccessToken = await authProvider.refresh();
			if (newAccessToken) {
				accessToken = newAccessToken;
			}
		}

		let response = await this._callApiInternal(options, authProvider.clientId, accessToken.accessToken);
		if (response.status === 401 && authProvider.refresh) {
			await authProvider.refresh();
			accessToken = await authProvider.getAccessToken(options.scope ? [options.scope] : []);
			if (accessToken) {
				response = await this._callApiInternal(options, authProvider.clientId, accessToken.accessToken);
			}
		}

		return transformTwitchApiResponse<T>(response);
	}

	/**
	 * Makes a call to the Twitch API using your access token.
	 *
	 * @deprecated Use callApi instead.
	 *
	 * @param options The configuration of the call.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-explicit-any
	async callAPI<T = any>(options: TwitchApiCallOptions) {
		deprecate('[twitch] ChatClient#callAPI', 'Use callApi instead.');
		return this.callApi<T>(options);
	}

	/**
	 * The default specs for cheermotes.
	 */
	get cheermoteDefaults() {
		return this._config.cheermotes;
	}

	/**
	 * A group of Kraken API methods.
	 */
	@CachedGetter()
	get kraken() {
		return new KrakenApiGroup(this);
	}

	/**
	 * A group of Helix API methods.
	 */
	@CachedGetter()
	get helix() {
		return new HelixApiGroup(this);
	}

	/**
	 * The API methods that deal with badges.
	 */
	@CachedGetter()
	get badges() {
		return new BadgesApi(this);
	}

	/**
	 * Various API methods that are not officially supported by Twitch.
	 */
	@CachedGetter()
	get unsupported() {
		return new UnsupportedApi(this);
	}

	private async _callApiInternal(options: TwitchApiCallOptions, clientId?: string, accessToken?: string) {
		if (options.type === TwitchApiCallType.Helix) {
			return this._helixRateLimiter.request({ options, clientId, accessToken });
		}

		return callTwitchApiRaw(options, clientId, accessToken);
	}
}
