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

	/**
	 * A list of channel-defined tags to apply to the channel. To remove all tags from the channel, set tags to an empty array.
	 *
	 * A channel may specify a maximum of 10 tags. Each tag is limited to a maximum of 25 characters and may not be an empty string
	 * or contain spaces or special characters. Tags are case insensitive.
	 */
	tags?: string[];

	/**
	 * The content classification labels to apply to the channel.
	 */
	contentClassificationLabels?: string[];

	/**
	 * Whether the channel currently displays branded content.
	 */
	isBrandedContent?: boolean;
}
