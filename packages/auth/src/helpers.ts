import type { Logger } from '@d-fischer/logger';
import { callTwitchApi, HttpStatusCodeError } from '@twurple/api-call';
import type { AccessToken } from './AccessToken';
import { type AccessTokenData } from './AccessToken.external';
import { InvalidTokenError } from './errors/InvalidTokenError';
import {
	createExchangeCodeQuery,
	createGetAppTokenQuery,
	createRefreshTokenQuery,
	createRevokeTokenQuery
} from './helpers.external';
import type { AuthProvider } from './providers/AuthProvider';
import { TokenInfo } from './TokenInfo';
import { type TokenInfoData } from './TokenInfo.external';

/** @private */
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
 * Retrieves an access token with your client credentials and an authorization code.
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
 * Retrieves an app access token with your client credentials.
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
 * Retrieves information about an access token.
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
export async function getValidTokenFromProvider(
	provider: AuthProvider,
	scopes?: string[],
	logger?: Logger
): Promise<{ accessToken: AccessToken; tokenInfo: TokenInfo }> {
	let lastTokenError: InvalidTokenError | null = null;

	try {
		const accessToken = await provider.getAccessToken(scopes);
		if (accessToken) {
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

	logger?.warn('No valid token available; trying to refresh');

	if (provider.refresh) {
		try {
			const newToken = await provider.refresh();

			if (newToken) {
				// check validity
				const tokenInfo = await getTokenInfo(newToken.accessToken);
				return { accessToken: newToken, tokenInfo };
			}
		} catch (e: unknown) {
			if (e instanceof InvalidTokenError) {
				lastTokenError = e;
			} else {
				logger?.error(`Refreshing the access token failed: ${(e as Error).message}`);
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
 * Compares scopes for a non-upgradable `AuthProvider` instance.
 *
 * @param scopesToCompare The scopes to compare against.
 * @param requestedScopes The scopes you requested.
 */
export function compareScopes(scopesToCompare: string[], requestedScopes?: string[]): void {
	if (requestedScopes !== undefined) {
		const scopes = new Set<string>(
			scopesToCompare.flatMap(scope => [scope, ...(scopeEquivalencies.get(scope) ?? [])])
		);

		if (requestedScopes.some(scope => !scopes.has(scope))) {
			throw new Error(
				`This token does not have the requested scopes (${requestedScopes.join(', ')}) and can not be upgraded.
If you need dynamically upgrading scopes, please implement the AuthProvider interface accordingly:

\thttps://twurple.js.org/reference/auth/interfaces/AuthProvider.html`
			);
		}
	}
}

/**
 * Compares scopes for a non-upgradable `AuthProvider` instance, loading them from the token if necessary.
 *
 * @param clientId The client ID of your application.
 * @param token The access token.
 * @param loadedScopes The scopes that were already loaded.
 * @param requestedScopes The scopes you requested.
 */
export async function loadAndCompareScopes(
	clientId: string,
	token: string,
	loadedScopes?: string[],
	requestedScopes?: string[]
): Promise<string[] | undefined> {
	if (requestedScopes?.length) {
		const scopesToCompare = loadedScopes ?? (await getTokenInfo(token, clientId)).scopes;
		compareScopes(scopesToCompare, requestedScopes);

		return scopesToCompare;
	}

	return loadedScopes;
}
