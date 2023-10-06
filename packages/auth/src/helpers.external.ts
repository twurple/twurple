/** @internal */
export function createExchangeCodeQuery(clientId: string, clientSecret: string, code: string, redirectUri: string) {
	return {
		grant_type: 'authorization_code',
		client_id: clientId,
		client_secret: clientSecret,
		code,
		redirect_uri: redirectUri,
	};
}

/** @internal */
export function createGetAppTokenQuery(clientId: string, clientSecret: string) {
	return {
		grant_type: 'client_credentials',
		client_id: clientId,
		client_secret: clientSecret,
	};
}

/** @internal */
export function createRefreshTokenQuery(clientId: string, clientSecret: string, refreshToken: string) {
	return {
		grant_type: 'refresh_token',
		client_id: clientId,
		client_secret: clientSecret,
		refresh_token: refreshToken,
	};
}

/** @internal */
export function createRevokeTokenQuery(clientId: string, accessToken: string) {
	return {
		client_id: clientId,
		token: accessToken,
	};
}
