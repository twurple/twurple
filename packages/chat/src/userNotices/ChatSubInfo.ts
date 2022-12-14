/**
 * Information about the original gift of a subscription.
 */
export interface ChatSubOriginalGiftInfo {
	/**
	 * Whether the gift was anonymous.
	 */
	anonymous: boolean;

	/**
	 * The ID of the user that originally gifted the subscription. Only set if the gift was not anonymous.
	 */
	userId?: string;

	/**
	 * The name of the user that originally gifted the subscription. Only set if the gift was not anonymous.
	 */
	userName?: string;

	/**
	 * The display name of the user that originally gifted the subscription. Only set if the gift was not anonymous.
	 */
	userDisplayName?: string;

	/**
	 * The duration of the gift, in months.
	 */
	duration: number;

	/**
	 * The number of the month out of the total gift duration that was just redeemed.
	 */
	redeemedMonth: number;
}

/**
 * Information about a subscription.
 */
export interface ChatSubInfo {
	/**
	 * The user ID of the subscribing user.
	 */
	userId: string;

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

	/**
	 * The info about the original gift of the subscription, when renewing a multi-month gift.
	 */
	originalGiftInfo?: ChatSubOriginalGiftInfo;
}

/**
 * Information about a subscription that was gifted.
 *
 * @inheritDoc
 */
export interface ChatSubGiftInfo extends ChatSubInfo {
	/**
	 * The name of the user that gifted the subscription.
	 */
	gifter?: string;

	/**
	 * The user ID of the user that gifted the subscription.
	 */
	gifterUserId?: string;

	/**
	 * The display name of the user that gifted the subscription.
	 */
	gifterDisplayName?: string;

	/**
	 * The number of subscriptions the gifting user has already gifted in total.
	 */
	gifterGiftCount?: number;

	/**
	 * The duration of the gifted subscription, in months.
	 */
	giftDuration: number;
}

/**
 * Information about a subscription that was upgraded from a Prime subscription.
 */
export interface ChatSubUpgradeInfo {
	/**
	 * The user ID of the subscribing user.
	 */
	userId: string;

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
}

/**
 * Information about a subscription that was upgraded from a gift.
 */
export interface ChatSubGiftUpgradeInfo {
	/**
	 * The user ID of the subscribing user.
	 */
	userId: string;

	/**
	 * The display name of the subscribing user.
	 */
	displayName: string;

	/**
	 * The name of the user that gifted the original subscription.
	 */
	gifter: string;

	/**
	 * The display name of the user that gifted the original subscription.
	 */
	gifterDisplayName: string;
}

/**
 * Information about a subsription extension.
 */
export interface ChatSubExtendInfo {
	/**
	 * The user ID of the subscribing user.
	 */
	userId: string;

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
	 * The number of total months of subscriptions for the channel.
	 */
	months: number;

	/**
	 * The month when the subscription will now end.
	 *
	 * 1 corresponds to January, and 12 means December.
	 */
	endMonth: number;
}
