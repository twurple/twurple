/** @private */
export interface TokenAuthorization {
	scopes: string[];
	created_at: string[];
	updated_at: string[];
}

/** @private */
export type TokenStructure =
	| {
			valid: true;
			authorization: TokenAuthorization;
			user_name: string;
			user_id: string;
			client_id: string;
			expires_in?: number;
	  }
	| {
			valid: false;
			authorization: null;
	  };

/** @private */
export interface TokenInfoData {
	token: TokenStructure;
}

/**
 * Information about an access token.
 */
export default class TokenInfo {
	private readonly _obtainmentDate: Date;

	/** @private */
	constructor(private readonly _data: TokenStructure) {
		this._obtainmentDate = new Date();
	}

	/**
	 * The client ID.
	 */
	get clientId() {
		return this._data.valid ? this._data.client_id : null;
	}

	/**
	 * The ID of the authenticated user.
	 */
	get userId() {
		return this._data.valid ? this._data.user_id : null;
	}

	/**
	 * The user name of the authenticated user.
	 */
	get userName() {
		return this._data.valid ? this._data.user_name : null;
	}

	/**
	 * The scopes for which this token is valid.
	 */
	get scopes() {
		return this._data.valid ? this._data.authorization.scopes : [];
	}

	/**
	 * Whether the token is valid or not.
	 *
	 * @deprecated This will be replaced with an exception soon; you can already add a try-catch for this future case.
	 */
	get valid() {
		return this._data.valid;
	}

	/**
	 * The time when the token will expire.
	 *
	 * If this returns null, it means that the token is either invalid or never expires (happens with old client IDs).
	 *
	 * @deprecated There is no replacement planned (yet) because expires_in does not exist in the new validate resource
	 */
	get expiryDate() {
		if (!this._data.valid || !this._data.expires_in) {
			return null;
		}

		return new Date(this._obtainmentDate.getTime() + this._data.expires_in * 1000);
	}
}
