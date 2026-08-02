/**
 * The information necessary for a user to authorize an application using Device Code Flow.
 */
export interface DeviceCodeInfo {
	/**
	 * The device code, used to exchange for an access token once the user authorized.
	 */
	deviceCode: string;

	/**
	 * The code the user needs to enter on the verification page.
	 */
	userCode: string;

	/**
	 * The URI returned by Twitch where the user needs to authorize your application.
	 */
	verificationUri: string;

	/**
	 * The time, in seconds from obtainment, when the device code expires.
	 */
	expiresIn: number;

	/**
	 * The minimum time, in seconds, to wait between polling attempts.
	 */
	interval: number;
}
