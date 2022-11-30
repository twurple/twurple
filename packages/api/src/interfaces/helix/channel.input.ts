/**
 * Channel data to update using {@link HelixChannelApi#updateChannelInfo}}.
 */
export interface HelixChannelUpdate {
	/**
	 * The language of the stream.
	 */
	language?: string;

	/**
	 * The ID of the game you're playing.
	 */
	gameId?: string;

	/**
	 * The title of the stream.
	 */
	title?: string;

	/**
	 * The delay of the stream, in seconds.
	 *
	 * Only works if you're a Twitch partner.
	 */
	delay?: number;
}
