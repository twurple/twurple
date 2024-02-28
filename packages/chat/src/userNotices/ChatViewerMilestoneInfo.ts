/**
 * Information about an announcement.
 */
export interface ChatViewerMilestoneInfo {
	/**
	 * The name of the category.
	 *
	 * Currently, the only known ritual is "watch-streak".
	 */
	categoryName: string;

	/**
	 * The value of the milestone.
	 *
	 * With the "watch-streak" milestone, this is how many streams the viewer has attended in a row.
	 */
	value?: number;

	/**
	 * The reward for the milestone.
	 *
	 * With the "watch-streak" milestone, this is the number of channel points the viewer received.
	 */
	reward?: number;

	/**
	 * The message sent with the milestone.
	 *
	 * With the "watch-streak" milestone, you can send an optional message.
	 */
	message?: string;
}
