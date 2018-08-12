/** @private */
export interface TokenAuthorization {
	scopes: string[];
	created_at: string[];
	updated_at: string[];
}

/** @private */
export type TokenStructure = {
	valid: true;
	authorization: TokenAuthorization;
	user_name: string;
	user_id: string;
	client_id: string;
} | {
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
	/** @private */
	constructor(private readonly _data: TokenStructure) {
	}

	/**
	 * The client ID.
	 */
	get clientId(): string | undefined {
		return this._data.valid ? this._data.client_id : undefined;
	}

	/**
	 * The ID of the authenticated user.
	 */
	get userId(): string | undefined {
		return this._data.valid ? this._data.user_id : undefined;
	}

	/**
	 * The user name of the authenticated user.
	 */
	get userName(): string | undefined {
		return this._data.valid ? this._data.user_name : undefined;
	}

	/**
	 * The scopes for which this token is valid.
	 */
	get scopes(): string[] {
		return this._data.valid ? this._data.authorization.scopes : [];
	}

	/**
	 * Whether the token is valid or not.
	 */
	get valid(): boolean {
		return this._data.valid;
	}
}
