import { type HelixForwardPagination } from '../../api/helix/HelixPagination';

/**
 * Data to create a new custom reward.
 */
export interface HelixCreateCustomRewardData {
	/**
	 * The title of the reward.
	 */
	title: string;

	/**
	 * The channel points cost of the reward.
	 */
	cost: number;

	/**
	 * The prompt shown to users when redeeming the reward.
	 */
	prompt?: string;

	/**
	 * Whether the reward is enabled (shown to users).
	 */
	isEnabled?: boolean;

	/**
	 * The hex code of the background color of the reward.
	 */
	backgroundColor?: string;

	/**
	 * Whether the reward requires user input to be redeemed.
	 */
	userInputRequired?: boolean;

	/**
	 * The maximum number of redemptions of the reward per stream. 0 or `null` means no limit.
	 */
	maxRedemptionsPerStream?: number | null;

	/**
	 * The maximum number of redemptions of the reward per stream for each user. 0 or `null` means no limit.
	 */
	maxRedemptionsPerUserPerStream?: number | null;

	/**
	 * The cooldown between two redemptions of the reward, in seconds. 0 or `null` means no cooldown.
	 */
	globalCooldown?: number | null;

	/**
	 * Whether the redemption should automatically set its status to fulfilled.
	 */
	autoFulfill?: boolean;
}

/**
 * Data to update an existing custom reward.
 *
 * @inheritDoc
 */
export interface HelixUpdateCustomRewardData extends Partial<HelixCreateCustomRewardData> {
	/**
	 * Whether the reward is paused. If true, users can't redeem it.
	 */
	isPaused?: boolean;
}

/**
 * Filters for the custom reward redemptions request.
 */
export interface HelixCustomRewardRedemptionFilter {
	/**
	 * Whether to put the newest redemptions first.
	 *
	 * Oldest redemptions are shown first by default.
	 */
	newestFirst?: boolean;
}

/**
 * @inheritDoc
 */
export interface HelixPaginatedCustomRewardRedemptionFilter
	extends HelixCustomRewardRedemptionFilter,
		HelixForwardPagination {}

/** @private */
export type HelixCustomRewardImageScale = 1 | 2 | 4;
