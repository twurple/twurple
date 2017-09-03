export interface AccessTokenData {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	scope: string;
}

export default class AccessToken {
	private _obtainedAt: Date;

	constructor(private _data: AccessTokenData, obtainedAt?: Date) {
		this._obtainedAt = obtainedAt || new Date();
	}

	get accessToken() {
		return this._data.access_token;
	}

	get refreshToken() {
		return this._data.refresh_token;
	}

	get expiresAt() {
		return new Date(this._obtainedAt.getTime() + this._data.expires_in * 1000);
	}

	get scope() {
		return this._data.scope.split(' ');
	}
}
