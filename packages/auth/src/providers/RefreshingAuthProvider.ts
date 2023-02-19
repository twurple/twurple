import type { MakeOptional } from '@d-fischer/shared-utils';
import { Enumerable } from '@d-fischer/shared-utils';
import { extractUserId, HellFreezesOverError, rtfm, type UserIdResolvable } from '@twurple/common';
import type { AccessToken, AccessTokenMaybeWithUserId, AccessTokenWithUserId } from '../AccessToken';
import { accessTokenIsExpired } from '../AccessToken';
import { InvalidTokenError } from '../errors/InvalidTokenError';
import { InvalidTokenTypeError } from '../errors/InvalidTokenTypeError';
import { UnknownIntentError } from '../errors/UnknownIntentError';
import { compareScopeSets, getAppToken, getTokenInfo, loadAndCompareTokenInfo, refreshUserToken } from '../helpers';
import { TokenFetcher } from '../TokenFetcher';
import { type AuthProvider } from './AuthProvider';

/**
 * Configuration for the {@link RefreshingAuthProvider}.
 */
export interface RefreshConfig {
	/**
	 * The client ID of your application.
	 */
	clientId: string;

	/**
	 * The client secret of your application.
	 */
	clientSecret: string;

	/**
	 * A callback that is called whenever the auth provider refreshes the token, e.g. to save the new data in your database.
	 *
	 * @param token The token data.
	 */
	onRefresh?: (userId: string, token: AccessToken) => void;

	/**
	 * The scopes to be implied by the provider's app access token.
	 */
	appImpliedScopes?: string[];
}

/**
 * An auth provider with the ability to make use of refresh tokens,
 * automatically refreshing the access token whenever necessary.
 */
@rtfm<RefreshingAuthProvider>('auth', 'RefreshingAuthProvider', 'clientId')
export class RefreshingAuthProvider implements AuthProvider {
	private readonly _clientId: string;
	@Enumerable(false) private readonly _clientSecret: string;
	@Enumerable(false) private readonly _userAccessTokens = new Map<
		string,
		MakeOptional<AccessTokenWithUserId, 'accessToken' | 'scope'>
	>();
	@Enumerable(false) private readonly _userTokenFetchers = new Map<string, TokenFetcher<AccessTokenWithUserId>>();
	private readonly _intentToUserId = new Map<string, string>();

	@Enumerable(false) private _appAccessToken?: AccessToken;
	@Enumerable(false) private readonly _appTokenFetcher;
	private readonly _appImpliedScopes: string[];

	private readonly _onRefresh?: (userId: string, token: AccessToken) => void;

	/**
	 * Creates a new auth provider based on the given one that can automatically
	 * refresh access tokens.
	 *
	 * @param refreshConfig The information necessary to automatically refresh an access token.
	 */
	constructor(refreshConfig: RefreshConfig) {
		this._clientId = refreshConfig.clientId;
		this._clientSecret = refreshConfig.clientSecret;
		this._onRefresh = refreshConfig.onRefresh;
		this._appImpliedScopes = refreshConfig.appImpliedScopes ?? [];
		this._appTokenFetcher = new TokenFetcher(async scopes => await this._fetchAppToken(scopes));
	}

	/**
	 * Adds the given user with their corresponding token to the provider.
	 *
	 * @param user The user to add.
	 * @param initialToken The token for the user.
	 * @param intents The intents to add to the user.
	 *
	 * Any intents that were already set before will be overwritten to point to this user instead.
	 */
	addUser(
		user: UserIdResolvable,
		initialToken: MakeOptional<AccessToken, 'accessToken' | 'scope'>,
		intents?: string[]
	): void {
		const userId = extractUserId(user);
		this._userAccessTokens.set(userId, {
			...initialToken,
			userId
		});
		if (!this._userTokenFetchers.has(userId)) {
			this._userTokenFetchers.set(
				userId,
				new TokenFetcher(async scopes => await this._fetchUserToken(userId, scopes))
			);
		}
		if (intents) {
			this.addIntentsToUser(user, intents);
		}
	}

	/**
	 * Figures out the user associated to the given token and adds them to the provider.
	 *
	 * If you already know the ID of the user you're adding,
	 * consider using {@link RefreshingAuthProvider#addUser} instead.
	 *
	 * @param initialToken The token for the user.
	 * @param intents The intents to add to the user.
	 *
	 * Any intents that were already set before will be overwritten to point to this user instead.
	 */
	async addUserForToken(initialToken: MakeOptional<AccessToken, 'scope'>, intents?: string[]): Promise<string> {
		const tokenInfo = await getTokenInfo(initialToken.accessToken);
		const { userId } = tokenInfo;
		if (!userId) {
			throw new InvalidTokenTypeError(
				'Could not determine a user ID for your token; you might be trying to disguise an app token as a user token.'
			);
		}

		const token = initialToken.scope
			? initialToken
			: {
					...initialToken,
					scope: tokenInfo.scopes
			  };

		this.addUser(userId, token, intents);

		return userId;
	}

	/**
	 * Adds intents to a user.
	 *
	 * Any intents that were already set before will be overwritten to point to this user instead.
	 *
	 * @param user The user to add intents to.
	 * @param intents The intents to add to the user.
	 */
	addIntentsToUser(user: UserIdResolvable, intents: string[]): void {
		const userId = extractUserId(user);
		if (!this._userAccessTokens.has(userId)) {
			throw new Error('Trying to add intents to a user that was not added to this provider');
		}
		for (const intent of intents) {
			this._intentToUserId.set(intent, userId);
		}
	}

	/**
	 * Requests that the provider fetches a new token from Twitch for the given user.
	 *
	 * @param user The user to refresh the token for.
	 */
	async refreshAccessTokenForUser(user: UserIdResolvable): Promise<AccessTokenWithUserId> {
		const userId = extractUserId(user);
		const previousTokenData = this._userAccessTokens.get(userId);

		if (!previousTokenData) {
			throw new Error('Trying to refresh token for user that was not added to the provider');
		}

		const tokenData = await refreshUserToken(this.clientId, this._clientSecret, previousTokenData.refreshToken!);
		this._userAccessTokens.set(userId, {
			...tokenData,
			userId
		});

		this._onRefresh?.(userId, tokenData);

		return {
			...tokenData,
			userId
		};
	}

	/**
	 * Requests that the provider fetches a new token from Twitch for the given intent.
	 *
	 * @param intent The intent to refresh the token for.
	 */
	async refreshAccessTokenForIntent(intent: string): Promise<AccessTokenWithUserId> {
		if (!this._intentToUserId.has(intent)) {
			throw new UnknownIntentError(intent);
		}

		const userId = this._intentToUserId.get(intent)!;

		return await this.refreshAccessTokenForUser(userId);
	}

	/**
	 * The client ID.
	 */
	get clientId(): string {
		return this._clientId;
	}

	/**
	 * Gets the scopes that are currently available using the access token.
	 *
	 * @param user The user to get the current scopes for.
	 */
	getCurrentScopesForUser(user: UserIdResolvable): string[] {
		const token = this._userAccessTokens.get(extractUserId(user));

		if (!token) {
			throw new Error('Trying to get scopes for user that was not added to the provider');
		}

		return token.scope ?? [];
	}

	/**
	 * Gets an access token for the given user.
	 *
	 * @param user The user to get an access token for.
	 * @param scopes The requested scopes.
	 */
	async getAccessTokenForUser(user: UserIdResolvable, scopes?: string[]): Promise<AccessTokenWithUserId | null> {
		const fetcher = this._userTokenFetchers.get(extractUserId(user));

		if (!fetcher) {
			return null;
		}

		return await fetcher.fetch(scopes);
	}

	/**
	 * Fetches a token for a user identified by the given intent.
	 *
	 * @param intent The intent to fetch a token for.
	 * @param scopes The requested scopes.
	 */
	async getAccessTokenForIntent(intent: string, scopes?: string[]): Promise<AccessTokenWithUserId | null> {
		if (!this._intentToUserId.has(intent)) {
			return null;
		}

		const userId = this._intentToUserId.get(intent)!;

		const newToken = await this.getAccessTokenForUser(userId, scopes);

		if (!newToken) {
			throw new HellFreezesOverError(
				`Found intent ${intent} corresponding to user ID ${userId} but no token was found`
			);
		}

		return {
			...newToken,
			userId
		};
	}

	/**
	 * Fetches any token to use with a request that supports both user and app tokens,
	 * i.e. public data relating to a user.
	 *
	 * @param user The user.
	 */
	async getAnyAccessToken(user?: UserIdResolvable): Promise<AccessTokenMaybeWithUserId> {
		if (user) {
			const userId = extractUserId(user);
			if (this._userAccessTokens.has(userId)) {
				const token = await this.getAccessTokenForUser(userId);
				if (!token) {
					throw new HellFreezesOverError(
						`Token for user ID ${userId} exists but nothing was returned by getAccessTokenForUser`
					);
				}
				return {
					...token,
					userId
				};
			}
		}

		return await this.getAppAccessToken();
	}

	/**
	 * Fetches an app access token.
	 *
	 * @param forceNew Whether to always get a new token, even if the old one is still deemed valid internally.
	 */
	async getAppAccessToken(forceNew = false): Promise<AccessToken> {
		if (forceNew) {
			this._appAccessToken = undefined;
		}
		return await this._appTokenFetcher.fetch(this._appImpliedScopes);
	}

	private async _fetchUserToken(userId: string, scopeSets: string[][]): Promise<AccessTokenWithUserId> {
		const previousToken = this._userAccessTokens.get(userId);

		if (!previousToken) {
			throw new Error('Trying to get token for user that was not added to the provider');
		}

		// if we don't have a current token, we just pass this and refresh right away
		if (previousToken.accessToken && !accessTokenIsExpired(previousToken)) {
			try {
				// don't create new object on every get
				if (previousToken.scope) {
					compareScopeSets(previousToken.scope, scopeSets);
					return previousToken as AccessTokenWithUserId;
				}

				const [scope = []] = await loadAndCompareTokenInfo(
					this._clientId,
					previousToken.accessToken,
					userId,
					previousToken.scope,
					scopeSets
				);
				const newToken: AccessTokenWithUserId = {
					...(previousToken as AccessTokenWithUserId),
					scope
				};
				this._userAccessTokens.set(userId, newToken);
				return newToken;
			} catch (e) {
				// if loading scopes failed, ignore InvalidTokenError and proceed with refreshing
				if (!(e instanceof InvalidTokenError)) {
					throw e;
				}
			}
		}

		const refreshedToken = await this.refreshAccessTokenForUser(userId);
		compareScopeSets(refreshedToken.scope, scopeSets);
		return refreshedToken;
	}

	private async _fetchAppToken(scopeSets: string[][]): Promise<AccessToken> {
		if (scopeSets.length > 0) {
			for (const scopes of scopeSets) {
				if (this._appImpliedScopes.length) {
					if (scopes.every(scope => !this._appImpliedScopes.includes(scope))) {
						throw new Error(
							`One of the scopes ${scopes.join(
								', '
							)} requested but only the scope ${this._appImpliedScopes.join(', ')} is implied`
						);
					}
				} else {
					throw new Error(
						`One of the scopes ${scopes.join(
							', '
						)} requested but the client credentials flow does not support scopes`
					);
				}
			}
		}

		if (!this._appAccessToken || accessTokenIsExpired(this._appAccessToken)) {
			return await this._refreshAppToken();
		}

		return this._appAccessToken;
	}

	private async _refreshAppToken(): Promise<AccessToken> {
		return (this._appAccessToken = await getAppToken(this._clientId, this._clientSecret));
	}
}
