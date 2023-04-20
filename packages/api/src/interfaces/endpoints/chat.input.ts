import { type HelixChatAnnouncementColor } from './chat.external';

/**
 * An update request for a broadcaster's chat settings.
 */
export interface HelixUpdateChatSettingsParams {
	/**
	 * Whether slow mode should be enabled.
	 */
	slowModeEnabled?: boolean;

	/**
	 * The time to wait between messages in slow mode, in seconds.
	 */
	slowModeDelay?: number;

	/**
	 * Whether follower only mode should be enabled.
	 */
	followerOnlyModeEnabled?: boolean;

	/**
	 * The time after which users should be able to send messages after following, in minutes.
	 */
	followerOnlyModeDelay?: number;

	/**
	 * Whether subscriber only mode should be enabled.
	 */
	subscriberOnlyModeEnabled?: boolean;

	/**
	 * Whether emote only mode should be enabled.
	 */
	emoteOnlyModeEnabled?: boolean;

	/**
	 * Whether unique chat mode should be enabled.
	 */
	uniqueChatModeEnabled?: boolean;

	/**
	 * Whether non-moderator messages should be delayed.
	 */
	nonModeratorChatDelayEnabled?: boolean;

	/**
	 * The delay of non-moderator messages, in seconds.
	 */
	nonModeratorChatDelay?: number;
}

/**
 * A request to send an announcement to a broadcaster's chat.
 */
export interface HelixSendChatAnnouncementParams {
	/**
	 * The announcement to make in the broadcaster's chat room. Announcements are limited to a maximum of 500 characters; announcements longer than 500 characters are truncated.
	 */
	message: string;

	/**
	 * The color used to highlight the announcement. If color is set to `primary` or is not set, the channel’s accent color is used to highlight the announcement.
	 */
	color?: HelixChatAnnouncementColor;
}

export type HelixChatBadgeScale = 1 | 2 | 4;
