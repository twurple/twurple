/** @private */
export interface AccessTokenData {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	scope: string;
}

export default class AccessToken {
	private readonly _obtainedAt: Date;

	/** @private */
	constructor(private readonly _data: AccessTokenData, obtainedAt?: Date) {
		this._obtainedAt = obtainedAt || new Date();
	}

	get accessToken() {
		return this._data.access_token;
	}

	get refreshToken() {
		return this._data.refresh_token;
	}

	get expiresAt() {
		if (!this._data.expires_in) {
			return null;
		}
		return new Date(this._obtainedAt.getTime() + this._data.expires_in * 1000);
	}

	get scope() {
		return this._data.scope.split(' ');
	}
}
