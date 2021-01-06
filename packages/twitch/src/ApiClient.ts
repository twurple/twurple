import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import type { LoggerOptions, LogLevel } from '@d-fischer/logger';
import type { TwitchApiCallFetchOptions, TwitchApiCallOptions } from 'twitch-api-call';
import {
	callTwitchApi,
	callTwitchApiRaw,
	HttpStatusCodeError,
	transformTwitchApiResponse,
	TwitchApiCallType
} from 'twitch-api-call';

import type { AccessToken, AuthProvider, AuthProviderTokenType, TokenInfoData } from 'twitch-auth';
import { InvalidTokenError, TokenInfo } from 'twitch-auth';
import { CheermoteBackground, CheermoteScale, CheermoteState, rtfm } from 'twitch-common';

import { BadgesApi } from './API/Badges/BadgesApi';
import { HelixApiGroup } from './API/Helix/HelixApiGroup';
import { HelixRateLimiter } from './API/Helix/HelixRateLimiter';
import { KrakenApiGroup } from './API/Kraken/KrakenApiGroup';
import { UnsupportedApi } from './API/Unsupported/UnsupportedApi';

import { ConfigError } from './Errors/ConfigError';

/**
 * Default configuration for the cheermote API.
 *
 * @deprecated Pass the full {@CheermoteFormat} to the applicable methods instead.
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
	 * Additional options to pass to the fetch method.
	 */
	fetchOptions?: TwitchApiCallFetchOptions;

	/**
	 * Whether to authenticate the client before a request is made.
	 *
	 * @deprecated Call {@ApiClient#requestScopes} after instantiating the client instead.
	 */
	preAuth: boolean;

	/**
	 * The scopes to request with the initial request, even if it's not necessary for the request.
	 *
	 * @deprecated Call {@ApiClient#requestScopes} after instantiating the client instead.
	 */
	initialScopes?: string[];

	/**
	 * Default values for fetched cheermotes.
	 *
	 * @deprecated Pass the full {@CheermoteFormat} to the applicable methods instead.
	 */
	cheermotes: TwitchCheermoteConfig;

	/**
	 * The minimum level of log levels to see. Defaults to critical errors.
	 *
	 * @deprecated Use logger.minLevel instead.
	 */
	logLevel?: LogLevel;

	/**
	 * Options to pass to the logger.
	 */
	logger?: Partial<LoggerOptions>;
}

/**
 * @private
 */
export interface TwitchApiCallOptionsInternal {
	options: TwitchApiCallOptions;
	clientId?: string;
	accessToken?: string;
	fetchOptions?: TwitchApiCallFetchOptions;
}

/**
 * An API client for the Twitch Kraken and Helix APIs.
 */
@Cacheable
@rtfm('twitch', 'ApiClient')
export class ApiClient implements AuthProvider {
	private readonly _config: ApiConfig;
	private readonly _helixRateLimiter: HelixRateLimiter;

	/**
	 * Creates a new API client instance.
	 *
	 * @param config Configuration for the client instance.
	 */
	constructor(config: Partial<ApiConfig>) {
		const { authProvider, ...restConfig } = config;
		if (!authProvider) {
			throw new ConfigError('No auth provider given. Please supply the `authProvider` option.');
		}

		this._helixRateLimiter = new HelixRateLimiter({ logger: { minLevel: config.logLevel, ...config.logger } });

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
			void authProvider.getAccessToken(this._config.initialScopes);
		}
	}

	/**
	 * Requests scopes from the auth provider.
	 *
	 * @param scopes The scopes to request.
	 */
	async requestScopes(scopes: string[]): Promise<void> {
		await this._config.authProvider.getAccessToken(scopes);
	}

	/**
	 * Retrieves information about your access token.
	 */
	async getTokenInfo(): Promise<TokenInfo> {
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
	async getAccessToken(scopes?: string | string[]): Promise<AccessToken | null> {
		return this._config.authProvider.getAccessToken(scopes);
	}

	/**
	 * The scopes that are currently available using the access token.
	 *
	 * @deprecated Use {@AuthProvider#currentScopes} directly instead.
	 */
	get currentScopes(): string[] {
		return this._config.authProvider.currentScopes;
	}

	/** @private */
	setAccessToken(token: AccessToken): void {
		this._config.authProvider.setAccessToken(token);
	}

	/**
	 * Forces the authentication provider to refresh the access token, if possible.
	 *
	 * @deprecated Use {@AuthProvider#refresh} directly instead.
	 */
	async refresh(): Promise<AccessToken | null> {
		return this._config.authProvider.refresh?.() ?? null;
	}

	/**
	 * Forces the authentication provider to refresh the access token, if possible.
	 *
	 * @deprecated Use {@AuthProvider#refresh} directly instead.
	 */
	async refreshAccessToken(): Promise<AccessToken | undefined> {
		return (await this.refresh()) ?? undefined;
	}

	/**
	 * The type of token used by the client.
	 */
	get tokenType(): AuthProviderTokenType {
		return this._config.authProvider.tokenType ?? 'user';
	}

	/**
	 * The client ID of your application.
	 */
	get clientId(): string {
		return this._config.authProvider.clientId;
	}

	/**
	 * Makes a call to the Twitch API using your access token.
	 *
	 * @param options The configuration of the call.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async callApi<T = any>(options: TwitchApiCallOptions): Promise<T> {
		const { authProvider } = this._config;
		const shouldAuth = options.auth ?? true;
		let accessToken = shouldAuth
			? await authProvider.getAccessToken(options.scope ? [options.scope] : undefined)
			: null;
		if (!accessToken) {
			return callTwitchApi<T>(options, authProvider.clientId, undefined, this._config.fetchOptions);
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
	 * The default specs for cheermotes.
	 */
	get cheermoteDefaults(): TwitchCheermoteConfig {
		return this._config.cheermotes;
	}

	/**
	 * A group of Kraken API methods.
	 */
	@CachedGetter()
	get kraken(): KrakenApiGroup {
		return new KrakenApiGroup(this);
	}

	/**
	 * A group of Helix API methods.
	 */
	@CachedGetter()
	get helix(): HelixApiGroup {
		return new HelixApiGroup(this);
	}

	/**
	 * The API methods that deal with badges.
	 */
	@CachedGetter()
	get badges(): BadgesApi {
		return new BadgesApi(this);
	}

	/**
	 * Various API methods that are not officially supported by Twitch.
	 */
	@CachedGetter()
	get unsupported(): UnsupportedApi {
		return new UnsupportedApi(this);
	}

	private async _callApiInternal(options: TwitchApiCallOptions, clientId?: string, accessToken?: string) {
		const { fetchOptions } = this._config;
		if (options.type === TwitchApiCallType.Helix) {
			return this._helixRateLimiter.request({ options, clientId, accessToken, fetchOptions });
		}

		return callTwitchApiRaw(options, clientId, accessToken, fetchOptions);
	}
}
