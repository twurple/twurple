/**
 * Data to create a new poll.
 */
export interface HelixCreatePollData {
	/**
	 * The title of the poll.
	 */
	title: string;

	/**
	 * The available choices for the poll.
	 */
	choices: string[];

	/**
	 * The duration of the poll, in seconds.
	 */
	duration: number;

	/**
	 * The number of channel points that a vote should cost. If not given, voting with channel points will be disabled.
	 */
	channelPointsPerVote?: number;
}
