/**
 * The possible time periods for a bits leaderboard.
 */
export type HelixBitsLeaderboardPeriod = 'day' | 'week' | 'month' | 'year' | 'all';

/**
 * Filters for the bits leaderboard request.
 */
export interface HelixBitsLeaderboardQuery {
	/**
	 * The number of leaderboard entries you want to get.
	 */
	count?: number;

	/**
	 * The time period from which bits should count towards the leaderboard.
	 *
	 * The leaderboards reset with the start of a new period, e.g. the `week` leaderboards reset every Monday midnight PST.
	 */
	period?: HelixBitsLeaderboardPeriod;

	/**
	 * The time to get the bits leaderboard for.
	 */
	startDate?: Date;

	/**
	 * The user ID to show.
	 *
	 * The leaderboard will be guaranteed to include this user and then have more users before and after that user.
	 */
	contextUserId?: string;
}
