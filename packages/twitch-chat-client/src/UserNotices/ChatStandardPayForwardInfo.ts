/**
 * Information about a "forward payment" to a specific user.
 */
export default interface ChatStandardPayForwardInfo {
	/**
	 * The user ID of the forwarding user.
	 */
	userId: string;

	/**
	 * The display name of the forwarding user.
	 */
	displayName: string;

	/**
	 * The user ID of the user receiving the new gift.
	 */
	recipientUserId: string;

	/**
	 * The display name of the user receiving the new gift.
	 */
	recipientDisplayName: string;

	/**
	 * The user ID of the original gifter.
	 *
	 * May be empty if the original gift was anonymous.
	 */
	originalGifterUserId?: string;

	/**
	 * The display name of the original gifter.
	 *
	 * May be empty if the original gift was anonymous.
	 */
	originalGifterDisplayName?: string;
}
