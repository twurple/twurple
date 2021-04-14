import type { Logger } from '@d-fischer/logger';
import { callTwitchApi, HttpStatusCodeError, TwitchApiCallType } from '@twurple/api-call';
import type { AccessTokenData } from './AccessToken';
import { AccessToken } from './AccessToken';
import type { AuthProvider } from './AuthProvider/AuthProvider';
import { InvalidTokenError } from './Errors/InvalidTokenError';
import type { TokenInfoData } from './TokenInfo';
import { TokenInfo } from './TokenInfo';

/**
 * Retrieves an access token with your client credentials and an authorization code.
 *
 * @param clientId The client ID of your application.
 * @param clientSecret The client secret of your application.
 * @param code The authorization code.
 * @param redirectUri The redirect URI. This serves no real purpose here, but must still match one of the redirect URIs you configured in the Twitch Developer dashboard.
 */
export async function exchangeCode(
	clientId: string,
	clientSecret: string,
	code: string,
	redirectUri: string
): Promise<AccessToken> {
	return new AccessToken(
		await callTwitchApi<AccessTokenData>({
			type: TwitchApiCallType.Auth,
			url: 'token',
			method: 'POST',
			query: {
				grant_type: 'authorization_code',
				client_id: clientId,
				client_secret: clientSecret,
				code,
				redirect_uri: redirectUri
			}
		})
	);
}

/**
 * Retrieves an app access token with your client credentials.
 *
 * @param clientId The client ID of your application.
 * @param clientSecret The client secret of your application.
 * @param clientSecret
 */
export async function getAppToken(clientId: string, clientSecret: string): Promise<AccessToken> {
	return new AccessToken(
		await callTwitchApi<AccessTokenData>({
			type: TwitchApiCallType.Auth,
			url: 'token',
			method: 'POST',
			query: {
				grant_type: 'client_credentials',
				client_id: clientId,
				client_secret: clientSecret
			}
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
	return new AccessToken(
		await callTwitchApi<AccessTokenData>({
			type: TwitchApiCallType.Auth,
			url: 'token',
			method: 'POST',
			query: {
				grant_type: 'refresh_token',
				client_id: clientId,
				client_secret: clientSecret,
				refresh_token: refreshToken
			}
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
		type: TwitchApiCallType.Auth,
		url: 'revoke',
		method: 'POST',
		query: {
			client_id: clientId,
			token: accessToken
		}
	});
}

/**
 * Retrieves information about an access token.
 *
 * @param clientId The client ID of your application.
 * @param accessToken The access token to get the information of.
 *
 * You need to obtain one using one of the [Twitch OAuth flows](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/).
 */
export async function getTokenInfo(accessToken: string, clientId?: string): Promise<TokenInfo> {
	try {
		const data = await callTwitchApi<TokenInfoData>(
			{ type: TwitchApiCallType.Auth, url: 'validate' },
			clientId,
			accessToken
		);
		return new TokenInfo(data);
	} catch (e) {
		if (e instanceof HttpStatusCodeError && e.statusCode === 401) {
			throw new InvalidTokenError();
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
	let lastTokenError: InvalidTokenError | undefined = undefined;

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
