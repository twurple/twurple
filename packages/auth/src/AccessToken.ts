import { Enumerable, mapNullable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';

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
@rtfm('auth', 'AccessToken')
export class AccessToken {
	@Enumerable(false) private readonly _data: AccessTokenData;
	@Enumerable(false) private readonly _obtainmentDate: Date;

	// expire a bit before Twitch says it does, a minute by default
	private _expiryGracePeriod = 60000;

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
	 * The time, in seconds from the obtainment date, when the access token expires.
	 *
	 * May be `null`, in which case the token does not expire.
	 * This can only be the case with very old Client IDs.
	 *
	 * This does **not** honor the expiry grace period; it contains the exact value from Twitch.
	 */
	get expiresIn(): number | null {
		return this._data.expires_in ?? null;
	}

	/**
	 * The date when the token was obtained.
	 */
	get obtainmentDate(): Date {
		return this._obtainmentDate;
	}

	/**
	 * The time when the access token will expire.
	 *
	 * May be `null`, in which case the token does not expire.
	 * This can only be the case with very old Client IDs.
	 *
	 * This honors the expiry grace period (1 minute by default).
	 */
	get expiryDate(): Date | null {
		return mapNullable(this.expiryMillis, _ => new Date(_));
	}

	/**
	 * Whether the token is expired.
	 *
	 * This honors the expiry grace period (1 minute by default).
	 */
	get isExpired(): boolean {
		return mapNullable(this.expiryMillis, _ => Date.now() > _) ?? false;
	}

	/**
	 * The scope the access token is valid for, i.e. what the token enables you to do.
	 */
	get scope(): string[] {
		return this._data.scope ?? [];
	}

	/**
	 * Changes the grace period in which the access token is considered expired before Twitch says it does, in milliseconds.
	 *
	 * @param millis The length of the grace period.
	 */
	setExpiryGracePeriod(millis: number): void {
		this._expiryGracePeriod = millis;
	}

	private get expiryMillis() {
		return mapNullable(
			this._data.expires_in,
			_ => this._obtainmentDate.getTime() + _ * 1000 - this._expiryGracePeriod
		);
	}
}
