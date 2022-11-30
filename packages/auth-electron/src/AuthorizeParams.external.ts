/** @private */
export interface AuthorizeParams {
	response_type: string;
	client_id: string;
	redirect_uri: string;
	scope: string;
	force_verify?: boolean;
}

/** @private */
export function createAuthorizeParams(clientId: string, redirectUri: string, scopes: string[]): AuthorizeParams {
	return {
		response_type: 'token',
		client_id: clientId,
		redirect_uri: redirectUri,
		scope: scopes.join(' ')
	};
}
