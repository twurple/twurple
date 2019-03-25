/**
 * Information about a subscription.
 */
export default interface ChatSubInfo {
	/**
	 * The display name of the subscribing user.
	 */
	displayName: string;

	/**
	 * The plan ID of the subscription.
	 *
	 * Tier 1, 2, 3 are '1000', '2000', '3000' respectively, and a Twitch Prime subscription is called 'Prime'.
	 */
	plan: string;

	/**
	 * The plan name of the subscription.
	 */
	planName: string;

	/**
	 * Whether the subscription was "paid" for with Twitch Prime.
	 */
	isPrime: boolean;

	/**
	 * The number of total months of subscriptions for the channel.
	 */
	months: number;

	/**
	 * The number of consecutive months of subscriptions for the channel.
	 *
	 * Will not be sent if the user resubscribing does not choose to.
	 */
	streak?: number;

	/**
	 * The message that was sent with the subscription.
	 */
	message?: string;
}

/**
 * Information about a subscription that was gifted.
 * @inheritDoc
 */
export interface ChatSubGiftInfo extends ChatSubInfo {
	/**
	 * The name of the user that gifted the subscription.
	 */
	gifter?: string;

	/**
	 * The display name of the user that gifted the subscription.
	 */
	gifterDisplayName?: string;

	/**
	 * The number of subscriptions the gifting user has already gifted in total.
	 */
	gifterGiftCount?: number;
}
