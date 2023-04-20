import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixChatSettingsData } from '../../interfaces/endpoints/chat.external';

/**
 * The settings of a broadcaster's chat.
 */
@rtfm<HelixChatSettings>('api', 'HelixChatSettings', 'broadcasterId')
export class HelixChatSettings extends DataObject<HelixChatSettingsData> {
	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * Whether slow mode is enabled.
	 */
	get slowModeEnabled(): boolean {
		return this[rawDataSymbol].slow_mode;
	}

	/**
	 * The time to wait between messages in slow mode, in seconds.
	 *
	 * Is `null` if slow mode is not enabled.
	 */
	get slowModeDelay(): number | null {
		return this[rawDataSymbol].slow_mode_wait_time;
	}

	/**
	 * Whether follower only mode is enabled.
	 */
	get followerOnlyModeEnabled(): boolean {
		return this[rawDataSymbol].follower_mode;
	}

	/**
	 * The time after which users are able to send messages after following, in minutes.
	 *
	 * Is `null` if follower only mode is not enabled,
	 * but may also be `0` if you can send messages immediately after following.
	 */
	get followerOnlyModeDelay(): number | null {
		return this[rawDataSymbol].follower_mode_duration;
	}

	/**
	 * Whether subscriber only mode is enabled.
	 */
	get subscriberOnlyModeEnabled(): boolean {
		return this[rawDataSymbol].subscriber_mode;
	}

	/**
	 * Whether emote only mode is enabled.
	 */
	get emoteOnlyModeEnabled(): boolean {
		return this[rawDataSymbol].emote_mode;
	}

	/**
	 * Whether unique chat mode is enabled.
	 */
	get uniqueChatModeEnabled(): boolean {
		return this[rawDataSymbol].unique_chat_mode;
	}
}
