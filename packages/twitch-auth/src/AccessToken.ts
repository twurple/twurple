import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';

/** @private */
export interface AccessTokenData {
	access_token: string;
	refresh_token: string;
	expires_in?: number;
	scope?: string[];
}

/**
 * Represents the data of an OAuth access token returned by Twitch.
 */
@rtfm('twitch-auth', 'AccessToken')
export class AccessToken {
	@Enumerable(false) private readonly _data: AccessTokenData;
	private readonly _obtainmentDate: Date;

	/** @private */
	constructor(data: AccessTokenData, obtainmentDate?: Date) {
		this._data = data;
		this._obtainmentDate = obtainmentDate ?? new Date();
	}

	/**
	 * The access token which is necessary for every request to the Twitch API.
	 */
	get accessToken(): string {
		return this._data.access_token;
	}

	/**
	 * The refresh token which is necessary to refresh the access token once it expires.
	 */
	get refreshToken(): string {
		return this._data.refresh_token;
	}

	/**
	 * The time when the access token will expire.
	 *
	 * May be `null`, in which case the token does not expire.
	 * This can only be the case with very old Client IDs.
	 */
	get expiryDate(): Date | null {
		if (!this._data.expires_in) {
			return null;
		}
		return new Date(this._obtainmentDate.getTime() + this._data.expires_in * 1000);
	}

	get isExpired(): boolean {
		if (!this._data.expires_in) {
			return false;
		}
		return Date.now() > this._obtainmentDate.getTime() + this._data.expires_in * 1000;
	}

	/**
	 * The scope the access token is valid for, i.e. what the token enables you to do.
	 */
	get scope(): string[] {
		return this._data.scope ?? [];
	}
}
