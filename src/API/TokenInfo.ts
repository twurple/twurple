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

export default class TokenInfo {
	/** @private */
	constructor(private readonly _data: TokenStructure) {
	}

	get clientId(): string | undefined {
		return this._data.valid ? this._data.client_id : undefined;
	}

	get userId(): string | undefined {
		return this._data.valid ? this._data.user_id : undefined;
	}

	get userName(): string | undefined {
		return this._data.valid ? this._data.user_name : undefined;
	}

	get scopes(): string[] {
		return this._data.valid ? this._data.authorization.scopes : [];
	}

	get valid(): boolean {
		return this._data.valid;
	}
}
