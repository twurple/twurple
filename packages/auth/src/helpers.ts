import type { Logger } from '@d-fischer/logger';
import { callTwitchApi, HttpStatusCodeError } from '@twurple/api-call';
import type { AccessToken } from './AccessToken';
import { type AccessTokenData } from './AccessToken.external';
import { InvalidTokenError } from './errors/InvalidTokenError';
import { InvalidTokenTypeError } from './errors/InvalidTokenTypeError';
import {
	createExchangeCodeQuery,
	createGetAppTokenQuery,
	createRefreshTokenQuery,
	createRevokeTokenQuery
} from './helpers.external';
import type { AuthProvider } from './providers/AuthProvider';
import { TokenInfo } from './TokenInfo';
import { type TokenInfoData } from './TokenInfo.external';

/** @internal */
function createAccessTokenFromData(data: AccessTokenData): AccessToken {
	return {
		accessToken: data.access_token,
		refreshToken: data.refresh_token || null,
		scope: data.scope ?? [],
		expiresIn: data.expires_in ?? null,
		obtainmentTimestamp: Date.now()
	};
}

/**
 * Gets an access token with your client credentials and an authorization code.
 *
 * @param clientId The client ID of your application.
 * @param clientSecret The client secret of your application.
 * @param code The authorization code.
 * @param redirectUri The redirect URI.
 *
 * This serves no real purpose here, but must still match one of the redirect URIs you configured in the Twitch Developer dashboard.
 */
export async function exchangeCode(
	clientId: string,
	clientSecret: string,
	code: string,
	redirectUri: string
): Promise<AccessToken> {
	return createAccessTokenFromData(
		await callTwitchApi<AccessTokenData>({
			type: 'auth',
			url: 'token',
			method: 'POST',
			query: createExchangeCodeQuery(clientId, clientSecret, code, redirectUri)
		})
	);
}

/**
 * Gets an app access token with your client credentials.
 *
 * @param clientId The client ID of your application.
 * @param clientSecret The client secret of your application.
 */
export async function getAppToken(clientId: string, clientSecret: string): Promise<AccessToken> {
	return createAccessTokenFromData(
		await callTwitchApi<AccessTokenData>({
			type: 'auth',
			url: 'token',
			method: 'POST',
			query: createGetAppTokenQuery(clientId, clientSecret)
		})
	);
}

/**
 * Refreshes an expired access token with your client credentials and the refresh token that was given by the initial authentication.
 *
 * @param clientId The client ID of your application.
 * @param clientSecret The client secret of your application.
 * @param refreshToken The refresh token.
 */
export async function refreshUserToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string
): Promise<AccessToken> {
	return createAccessTokenFromData(
		await callTwitchApi<AccessTokenData>({
			type: 'auth',
			url: 'token',
			method: 'POST',
			query: createRefreshTokenQuery(clientId, clientSecret, refreshToken)
		})
	);
}

/**
 * Revokes an access token.
 *
 * @param clientId The client ID of your application.
 * @param accessToken The access token.
 */
export async function revokeToken(clientId: string, accessToken: string): Promise<void> {
	await callTwitchApi({
		type: 'auth',
		url: 'revoke',
		method: 'POST',
		query: createRevokeTokenQuery(clientId, accessToken)
	});
}

/**
 * Gets information about an access token.
 *
 * @param accessToken The access token to get the information of.
 * @param clientId The client ID of your application.
 *
 * You need to obtain one using one of the [Twitch OAuth flows](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/).
 */
export async function getTokenInfo(accessToken: string, clientId?: string): Promise<TokenInfo> {
	try {
		const data = await callTwitchApi<TokenInfoData>({ type: 'auth', url: 'validate' }, clientId, accessToken);
		return new TokenInfo(data);
	} catch (e) {
		if (e instanceof HttpStatusCodeError && e.statusCode === 401) {
			throw new InvalidTokenError({ cause: e });
		}
		throw e;
	}
}

/** @private */
export async function getValidTokenFromProviderForUser(
	provider: AuthProvider,
	userId: string,
	scopes?: string[],
	logger?: Logger
): Promise<{ accessToken: AccessToken; tokenInfo: TokenInfo }> {
	let lastTokenError: InvalidTokenError | null = null;
	let foundUser = false;

	try {
		const accessToken = await provider.getAccessTokenForUser(userId, scopes);
		if (accessToken) {
			foundUser = true;
			// check validity
			const tokenInfo = await getTokenInfo(accessToken.accessToken);
			return { accessToken, tokenInfo };
		}
	} catch (e: unknown) {
		if (e instanceof InvalidTokenError) {
			lastTokenError = e;
		} else {
			logger?.error(`Retrieving an access token failed: ${(e as Error).message}`);
		}
	}

	if (foundUser) {
		logger?.warn('No valid token available; trying to refresh');
		if (provider.refreshAccessTokenForUser) {
			try {
				const newToken = await provider.refreshAccessTokenForUser(userId);

				// check validity
				const tokenInfo = await getTokenInfo(newToken.accessToken);
				return { accessToken: newToken, tokenInfo };
			} catch (e: unknown) {
				if (e instanceof InvalidTokenError) {
					lastTokenError = e;
				} else {
					logger?.error(`Refreshing the access token failed: ${(e as Error).message}`);
				}
			}
		}
	}

	throw lastTokenError ?? new Error('Could not retrieve a valid token');
}

/** @private */
export async function getValidTokenFromProviderForIntent(
	provider: AuthProvider,
	intent: string,
	scopes?: string[],
	logger?: Logger
): Promise<{ accessToken: AccessToken; tokenInfo: TokenInfo }> {
	let lastTokenError: InvalidTokenError | null = null;
	let foundUser = false;

	if (!provider.getAccessTokenForIntent) {
		throw new InvalidTokenTypeError(
			`This call requires an AuthProvider that supports intents.
Please use an auth provider that does, such as \`RefreshingAuthProvider\`.`
		);
	}
	try {
		const accessToken = await provider.getAccessTokenForIntent(intent, scopes);
		if (accessToken) {
			foundUser = true;
			// check validity
			const tokenInfo = await getTokenInfo(accessToken.accessToken);
			return { accessToken, tokenInfo };
		}
	} catch (e: unknown) {
		if (e instanceof InvalidTokenError) {
			lastTokenError = e;
		} else {
			logger?.error(`Retrieving an access token failed: ${(e as Error).message}`);
		}
	}

	if (foundUser) {
		logger?.warn('No valid token available; trying to refresh');
		if (provider.refreshAccessTokenForIntent) {
			try {
				const newToken = await provider.refreshAccessTokenForIntent(intent);

				// check validity
				const tokenInfo = await getTokenInfo(newToken.accessToken);
				return { accessToken: newToken, tokenInfo };
			} catch (e: unknown) {
				if (e instanceof InvalidTokenError) {
					lastTokenError = e;
				} else {
					logger?.error(`Refreshing the access token failed: ${(e as Error).message}`);
				}
			}
		}
	}

	throw lastTokenError ?? new Error('Could not retrieve a valid token');
}

const scopeEquivalencies = new Map([
	['channel_commercial', ['channel:edit:commercial']],
	['channel_editor', ['channel:manage:broadcast']],
	['channel_read', ['channel:read:stream_key']],
	['channel_subscriptions', ['channel:read:subscriptions']],
	['user_blocks_read', ['user:read:blocked_users']],
	['user_blocks_edit', ['user:manage:blocked_users']],
	['user_follows_edit', ['user:edit:follows']],
	['user_read', ['user:read:email']],
	['user_subscriptions', ['user:read:subscriptions']],
	['user:edit:broadcast', ['channel:manage:broadcast', 'channel:manage:extensions']]
]);

/**
 * Compares scopes for a non-upgradable {@link AuthProvider} instance.
 *
 * @param scopesToCompare The scopes to compare against.
 * @param requestedScopes The scopes you requested.
 */
export function compareScopes(scopesToCompare: string[], requestedScopes?: string[]): void {
	if (requestedScopes?.length) {
		const scopes = new Set<string>(
			scopesToCompare.flatMap(scope => [scope, ...(scopeEquivalencies.get(scope) ?? [])])
		);

		if (requestedScopes.every(scope => !scopes.has(scope))) {
			const scopesStr = requestedScopes.join(', ');
			throw new Error(
				`This token does not have any of the requested scopes (${scopesStr}) and can not be upgraded.
If you need dynamically upgrading scopes, please implement the AuthProvider interface accordingly:

\thttps://twurple.js.org/reference/auth/interfaces/AuthProvider.html`
			);
		}
	}
}

/**
 * Compares scope sets for a non-upgradable {@link AuthProvider} instance.
 *
 * @param scopesToCompare The scopes to compare against.
 * @param requestedScopeSets The scope sets you requested.
 */
export function compareScopeSets(scopesToCompare: string[], requestedScopeSets: string[][]): void {
	for (const requestedScopes of requestedScopeSets) {
		compareScopes(scopesToCompare, requestedScopes);
	}
}

/**
 * Compares scopes for a non-upgradable `AuthProvider` instance, loading them from the token if necessary,
 * and returns them together with the user ID.
 *
 * @param clientId The client ID of your application.
 * @param token The access token.
 * @param userId The user ID that was already loaded.
 * @param loadedScopes The scopes that were already loaded.
 * @param requestedScopeSets The scope sets you requested.
 */
export async function loadAndCompareTokenInfo(
	clientId: string,
	token: string,
	userId?: string,
	loadedScopes?: string[],
	requestedScopeSets?: Array<string[] | undefined>
): Promise<[string[] | undefined, string]> {
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	if (requestedScopeSets?.length || !userId) {
		const userInfo = await getTokenInfo(token, clientId);
		if (!userInfo.userId) {
			throw new Error('Trying to use an app access token as a user access token');
		}

		const scopesToCompare = loadedScopes ?? userInfo.scopes;
		if (requestedScopeSets) {
			compareScopeSets(
				scopesToCompare,
				requestedScopeSets.filter((val): val is string[] => Boolean(val))
			);
		}

		return [scopesToCompare, userInfo.userId];
	}

	return [loadedScopes, userId];
}
