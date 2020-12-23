/**
 * Information about a Reward Gift triggered by a special event.
 */
export interface ChatRewardGiftInfo {
	/**
	 * The domain of the reward, i.e. an identifier of the special event that caused these rewards.
	 */
	domain: string;

	/**
	 * The amount of rewards that were shared.
	 */
	count: number;

	/**
	 * The user ID of the gifter.
	 */
	gifterId: string;

	/**
	 * The display name of the gifter.
	 */
	gifterDisplayName: string;

	/**
	 * The amount of total rewards the user shared.
	 */
	gifterGiftCount: number;

	/**
	 * The type of trigger that caused these rewards.
	 *
	 * The only known value of this is "CHEER".
	 */
	triggerType: string;
}
