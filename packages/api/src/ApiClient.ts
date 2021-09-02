import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import type { LoggerOptions } from '@d-fischer/logger';
import type { TwitchApiCallFetchOptions, TwitchApiCallOptions } from '@twurple/api-call';
import { callTwitchApi, callTwitchApiRaw, HttpStatusCodeError, transformTwitchApiResponse } from '@twurple/api-call';

import type { AuthProvider, TokenInfoData } from '@twurple/auth';
import { accessTokenIsExpired, InvalidTokenError, TokenInfo } from '@twurple/auth';
import { rtfm } from '@twurple/common';

import { BadgesApi } from './api/badges/BadgesApi';
import { HelixBitsApi } from './api/helix/bits/HelixBitsApi';
import { HelixChannelApi } from './api/helix/channel/HelixChannelApi';
import { HelixChannelPointsApi } from './api/helix/channelPoints/HelixChannelPointsApi';
import { HelixChatApi } from './api/helix/chat/HelixChatApi';
import { HelixClipApi } from './api/helix/clip/HelixClipApi';
import { HelixEventSubApi } from './api/helix/eventSub/HelixEventSubApi';
import { HelixExtensionsApi } from './api/helix/extensions/HelixExtensionsApi';
import { HelixGameApi } from './api/helix/game/HelixGameApi';
import { HelixApiGroup } from './api/helix/HelixApiGroup';
import { HelixRateLimiter } from './api/helix/HelixRateLimiter';
import { HelixHypeTrainApi } from './api/helix/hypeTrain/HelixHypeTrainApi';
import { HelixModerationApi } from './api/helix/moderation/HelixModerationApi';
import { HelixSearchApi } from './api/helix/search/HelixSearchApi';
import { HelixStreamApi } from './api/helix/stream/HelixStreamApi';
import { HelixSubscriptionApi } from './api/helix/subscriptions/HelixSubscriptionApi';
import { HelixTagApi } from './api/helix/tag/HelixTagApi';
import { HelixTeamApi } from './api/helix/team/HelixTeamApi';
import { HelixUserApi } from './api/helix/user/HelixUserApi';
import { HelixVideoApi } from './api/helix/video/HelixVideoApi';
import { UnsupportedApi } from './api/unsupported/UnsupportedApi';

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
 * An API client for the Twitch Helix API and other miscellaneous endpoints.
 */
@Cacheable
@rtfm('api', 'ApiClient')
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

		this._helixRateLimiter = new HelixRateLimiter({
			logger: { name: 'twurple:api:rate-limiter', ...config.logger }
		});
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
			const data = await this.callApi<TokenInfoData>({ type: 'auth', url: 'validate' });
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
	async callApi<T = unknown>(options: TwitchApiCallOptions): Promise<T> {
		const { authProvider } = this._config;
		const shouldAuth = options.auth ?? true;
		let accessToken = shouldAuth
			? await authProvider.getAccessToken(options.scope ? [options.scope] : undefined)
			: null;
		if (!accessToken) {
			return await callTwitchApi<T>(options, authProvider.clientId, undefined, this._config.fetchOptions);
		}

		if (accessTokenIsExpired(accessToken) && authProvider.refresh) {
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

		return await transformTwitchApiResponse<T>(response);
	}

	/**
	 * A group of Helix API methods.
	 *
	 * @deprecated Please remove `.helix` from your calls to access the API namespaces directly.
	 */
	@CachedGetter()
	get helix(): HelixApiGroup {
		return new HelixApiGroup(this);
	}

	/**
	 * The Helix bits API methods.
	 */
	@CachedGetter()
	get bits(): HelixBitsApi {
		return new HelixBitsApi(this);
	}

	/**
	 * The Helix channels API methods.
	 */
	@CachedGetter()
	get channels(): HelixChannelApi {
		return new HelixChannelApi(this);
	}

	/**
	 * The Helix channel points API methods.
	 */
	@CachedGetter()
	get channelPoints(): HelixChannelPointsApi {
		return new HelixChannelPointsApi(this);
	}

	/**
	 * The Helix chat API methods.
	 */
	@CachedGetter()
	get chat(): HelixChatApi {
		return new HelixChatApi(this);
	}

	/**
	 * The Helix clips API methods.
	 */
	@CachedGetter()
	get clips(): HelixClipApi {
		return new HelixClipApi(this);
	}

	/**
	 * The Helix EventSub API methods.
	 */
	@CachedGetter()
	get eventSub(): HelixEventSubApi {
		return new HelixEventSubApi(this);
	}

	/**
	 * The Helix extensions API methods.
	 */
	@CachedGetter()
	get extensions(): HelixExtensionsApi {
		return new HelixExtensionsApi(this);
	}

	/**
	 * The Helix Hype Train API methods.
	 */
	@CachedGetter()
	get hypeTrain(): HelixHypeTrainApi {
		return new HelixHypeTrainApi(this);
	}

	/**
	 * The Helix game API methods.
	 */
	@CachedGetter()
	get games(): HelixGameApi {
		return new HelixGameApi(this);
	}

	/**
	 * The Helix moderation API methods.
	 */
	@CachedGetter()
	get moderation(): HelixModerationApi {
		return new HelixModerationApi(this);
	}

	/**
	 * The Helix search API methods.
	 */
	@CachedGetter()
	get search(): HelixSearchApi {
		return new HelixSearchApi(this);
	}

	/**
	 * The Helix stream API methods.
	 */
	@CachedGetter()
	get streams(): HelixStreamApi {
		return new HelixStreamApi(this);
	}

	/**
	 * The Helix subscription API methods.
	 */
	@CachedGetter()
	get subscriptions(): HelixSubscriptionApi {
		return new HelixSubscriptionApi(this);
	}

	/**
	 * The Helix tag API methods.
	 */
	@CachedGetter()
	get tags(): HelixTagApi {
		return new HelixTagApi(this);
	}

	/**
	 * The Helix team API methods.
	 */
	@CachedGetter()
	get teams(): HelixTeamApi {
		return new HelixTeamApi(this);
	}

	/**
	 * The Helix user API methods.
	 */
	@CachedGetter()
	get users(): HelixUserApi {
		return new HelixUserApi(this);
	}

	/**
	 * The Helix video API methods.
	 */
	@CachedGetter()
	get videos(): HelixVideoApi {
		return new HelixVideoApi(this);
	}

	/**
	 * The API methods that deal with badges.
	 *
	 * @deprecated Use {@HelixChatApi}'s badge methods instead.
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
		if (options.type === 'helix') {
			return await this._helixRateLimiter.request({ options, clientId, accessToken, fetchOptions });
		}

		return await callTwitchApiRaw(options, clientId, accessToken, fetchOptions);
	}
}
