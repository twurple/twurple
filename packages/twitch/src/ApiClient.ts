import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import type { LoggerOptions } from '@d-fischer/logger';
import type { TwitchApiCallFetchOptions, TwitchApiCallOptions } from 'twitch-api-call';
import {
	callTwitchApi,
	callTwitchApiRaw,
	HttpStatusCodeError,
	transformTwitchApiResponse,
	TwitchApiCallType
} from 'twitch-api-call';

import type { AuthProvider, TokenInfoData } from 'twitch-auth';
import { InvalidTokenError, TokenInfo } from 'twitch-auth';
import { rtfm } from 'twitch-common';

import { BadgesApi } from './API/Badges/BadgesApi';
import { HelixApiGroup } from './API/Helix/HelixApiGroup';
import { HelixRateLimiter } from './API/Helix/HelixRateLimiter';
import { KrakenApiGroup } from './API/Kraken/KrakenApiGroup';
import { UnsupportedApi } from './API/Unsupported/UnsupportedApi';

import { ConfigError } from './Errors/ConfigError';

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
export class ApiClient {
	private readonly _config: ApiConfig;
	private readonly _helixRateLimiter: HelixRateLimiter;

	/**
	 * Creates a new API client instance.
	 *
	 * @param config Configuration for the client instance.
	 */
	constructor(config: ApiConfig) {
		if (!(config as Partial<ApiConfig>).authProvider) {
			throw new ConfigError('No auth provider given. Please supply the `authProvider` option.');
		}

		this._helixRateLimiter = new HelixRateLimiter({ logger: config.logger });
		this._config = config;
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
	 * A group of Kraken API methods.
	 *
	 * @deprecated Use Helix wherever possible.
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

	/** @private */
	get _authProvider(): AuthProvider {
		return this._config.authProvider;
	}

	private async _callApiInternal(options: TwitchApiCallOptions, clientId?: string, accessToken?: string) {
		const { fetchOptions } = this._config;
		if (options.type === TwitchApiCallType.Helix) {
			return this._helixRateLimiter.request({ options, clientId, accessToken, fetchOptions });
		}

		return callTwitchApiRaw(options, clientId, accessToken, fetchOptions);
	}
}
