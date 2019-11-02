/**
 * Information about a Prime Community Gift.
 */
export default interface ChatPrimeCommunityGiftInfo {
	/**
	 * The name of the gift.
	 */
	name: string;

	/**
	 * The user that sent the gift.
	 */
	gifter: string;

	/**
	 * The display name of the user that sent the gift.
	 */
	gifterDisplayName: string;
}
