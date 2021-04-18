import { mapNullable } from '@d-fischer/shared-utils';

/**
 * Represents the data of an OAuth access token returned by Twitch.
 */
export interface AccessToken {
	/**
	 * The access token which is necessary for every request to the Twitch API.
	 */
	accessToken: string;

	/**
	 * The refresh token which is necessary to refresh the access token once it expires.
	 */
	refreshToken: string | null;

	/**
	 * The scope the access token is valid for, i.e. what the token enables you to do.
	 */
	scope: string[];

	/**
	 * The time, in seconds from the obtainment date, when the access token expires.
	 *
	 * May be `null`, in which case the token does not expire.
	 * This can only be the case with very old Client IDs.
	 *
	 * This does **not** honor the expiry grace period; it contains the exact value from Twitch.
	 */
	expiresIn: number | null;

	/**
	 * The date when the token was obtained.
	 */
	obtainmentDate: Date;
}

// one minute
const EXPIRY_GRACE_PERIOD = 60000;

function getExpiryMillis(token: AccessToken) {
	return mapNullable(token.expiresIn, _ => token.obtainmentDate.getTime() + _ * 1000 - EXPIRY_GRACE_PERIOD);
}

/**
 * Calculates the date when the access token will expire.
 *
 * A one-minute grace period is applied for smooth handling of API latency.
 *
 * May be `null`, in which case the token does not expire.
 * This can only be the case with very old Client IDs.
 *
 * @param token The access token.
 */
export function getExpiryDateOfAccessToken(token: AccessToken): Date | null {
	return mapNullable(getExpiryMillis(token), _ => new Date(_));
}

/**
 * Calculates whether the given access token is expired.
 *
 * A one-minute grace period is applied for smooth handling of API latency.
 *
 * @param token The access token.
 *
 * Defaults to a minute.
 */
export function accessTokenIsExpired(token: AccessToken): boolean {
	return mapNullable(getExpiryMillis(token), _ => Date.now() > _) ?? false;
}
