import { callTwitchApi, TwitchApiCallType } from 'twitch-api-call';
import { AccessTokenData } from './AccessToken';

/** @deprecated No replacement. */
export interface LegacyAuthCredentials {
	client_id: string;
	client_secret: string;
}

/** @deprecated Use `exchangeCode` instead. */
export async function getUserAccessToken(creds: LegacyAuthCredentials, code: string, redirectUri = 'http://localhost') {
	return callTwitchApi<AccessTokenData>({
		type: TwitchApiCallType.Auth,
		url: 'token',
		method: 'POST',
		query: {
			grant_type: 'authorization_code',
			client_id: creds.client_id,
			client_secret: creds.client_secret,
			code,
			redirect_uri: redirectUri
		}
	});
}

/** @deprecated Use `refreshUserToken` instead. */
export async function refreshUserAccessToken(creds: LegacyAuthCredentials, refreshToken: string) {
	return callTwitchApi<AccessTokenData>({
		type: TwitchApiCallType.Auth,
		url: 'token',
		method: 'POST',
		query: {
			grant_type: 'refresh_token',
			client_id: creds.client_id,
			client_secret: creds.client_secret,
			refresh_token: refreshToken
		}
	});
}

/** @deprecated Use `getAppToken` instead. */
export async function getAppAccessToken(creds: LegacyAuthCredentials) {
	return callTwitchApi<AccessTokenData>({
		type: TwitchApiCallType.Auth,
		url: 'token',
		method: 'POST',
		query: {
			grant_type: 'client_credentials',
			client_id: creds.client_id,
			client_secret: creds.client_secret
		}
	})
}
