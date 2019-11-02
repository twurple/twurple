/** @private */
export interface TokenInfoData {
	client_id: string;
	login: string;
	scopes: string[];
	user_id: string;
	expires_in?: number;
}

/**
 * Information about an access token.
 */
export default class TokenInfo {
	private readonly _obtainmentDate: Date;

	/** @private */
	constructor(private readonly _data: TokenInfoData) {
		this._obtainmentDate = new Date();
	}

	/**
	 * The client ID.
	 */
	get clientId() {
		return this._data.client_id;
	}

	/**
	 * The ID of the authenticated user.
	 */
	get userId() {
		return this._data.user_id;
	}

	/**
	 * The user name of the authenticated user.
	 */
	get userName() {
		return this._data.login;
	}

	/**
	 * The scopes for which this token is valid.
	 */
	get scopes() {
		return this._data.scopes;
	}

	/**
	 * The time when the token will expire.
	 *
	 * If this returns null, it means that the token is either invalid or never expires (happens with old client IDs).
	 */
	get expiryDate() {
		if (!this._data.expires_in) {
			return null;
		}

		return new Date(this._obtainmentDate.getTime() + this._data.expires_in * 1000);
	}
}
