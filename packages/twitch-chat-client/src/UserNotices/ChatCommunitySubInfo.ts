/**
 * Information about a community gift subscription.
 */
export default interface ChatCommunitySubInfo {
	/**
	 * The user name of the user that gifted the subscription(s).
	 */
	gifter?: string;

	/**
	 * The display name of the user that gifted the subscription(s).
	 */
	gifterDisplayName?: string;

	/**
	 * The number of subscriptions the gifting user has already gifted in total.
	 */
	gifterGiftCount?: number;

	/**
	 * The number of subscriptions that were gifted to the channel.
	 */
	count: number;

	/**
	 * The plan ID of the subscription(s).
	 *
	 * Tier 1, 2, 3 are '1000', '2000', '3000' respectively. Prime subscriptions can't be gifted.
	 */
	plan: string;
}
