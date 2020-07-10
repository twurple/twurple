import { callTwitchApi, HttpStatusCodeError, TwitchApiCallType } from 'twitch-api-call';
import { AccessToken, AccessTokenData } from './AccessToken';
import { InvalidTokenError } from './Errors/InvalidTokenError';
import { TokenInfo, TokenInfoData } from './TokenInfo';

/**
 * Retrieves an access token with your client credentials and an authorization code.
 *
 * @param clientId The client ID of your application.
 * @param clientSecret The client secret of your application.
 * @param code The authorization code.
 * @param redirectUri The redirect URI. This serves no real purpose here, but must still match one of the redirect URIs you configured in the Twitch Developer dashboard.
 */
export async function exchangeCode(clientId: string, clientSecret: string, code: string, redirectUri: string) {
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
export async function getAppToken(clientId: string, clientSecret: string) {
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
export async function refreshUserToken(clientId: string, clientSecret: string, refreshToken: string) {
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
 * Retrieves information about an access token.
 *
 * @param clientId The client ID of your application.
 * @param accessToken The access token to get the information of.
 *
 * You need to obtain one using one of the [Twitch OAuth flows](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/).
 */
export async function getTokenInfo(accessToken: string, clientId?: string) {
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
