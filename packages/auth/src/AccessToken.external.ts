/** @private */
export interface AccessTokenData {
	access_token: string;
	refresh_token: string;
	expires_in?: number;
	scope?: string[];
}
