/**
 * The possible lengths of a channel commercial.
 */
export type CommercialLength = 30 | 60 | 90 | 120 | 150 | 180;

/**
 * The type of a user.
 */
export enum HelixUserType {
	/**
	 * A Twitch staff member.
	 */
	Staff = 'staff',

	/**
	 * A Twitch administrator.
	 */
	Admin = 'admin',

	/**
	 * A global moderator.
	 */
	GlobalMod = 'global_mod',

	/**
	 * A user with no special permissions across Twitch.
	 */
	None = ''
}
