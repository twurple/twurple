import type { HelixResponse } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { BaseApi } from '../../BaseApi';
import type { HelixChannelEmoteData } from './HelixChannelEmote';
import { HelixChannelEmote } from './HelixChannelEmote';
import type { HelixChatBadgeSetData } from './HelixChatBadgeSet';
import { HelixChatBadgeSet } from './HelixChatBadgeSet';
import type { HelixChatSettingsData } from './HelixChatSettings';
import { HelixChatSettings } from './HelixChatSettings';
import type { HelixEmoteData } from './HelixEmote';
import { HelixEmote } from './HelixEmote';
import type { HelixEmoteFromSetData } from './HelixEmoteFromSet';
import { HelixEmoteFromSet } from './HelixEmoteFromSet';
import type { HelixPrivilegedChatSettingsData } from './HelixPrivilegedChatSettings';
import { HelixPrivilegedChatSettings } from './HelixPrivilegedChatSettings';

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
	 * Whether unique chat mode (formerly known as r9k) should be enabled.
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
 * The Helix API methods that deal with chat.
 *
 * Can be accessed using `client.chat` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const rewards = await api.chat.getChannelBadges('125328655');
 * ```
 */
@rtfm('api', 'HelixChatApi')
export class HelixChatApi extends BaseApi {
	/**
	 * Retrieves all global badges.
	 */
	async getGlobalBadges(): Promise<HelixChatBadgeSet[]> {
		const result = await this._client.callApi<HelixResponse<HelixChatBadgeSetData>>({
			type: 'helix',
			url: 'chat/badges/global'
		});

		return result.data.map(data => new HelixChatBadgeSet(data));
	}

	/**
	 * Retrieves all badges specific to the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to retrieve badges for.
	 */
	async getChannelBadges(broadcaster: UserIdResolvable): Promise<HelixChatBadgeSet[]> {
		const result = await this._client.callApi<HelixResponse<HelixChatBadgeSetData>>({
			type: 'helix',
			url: 'chat/badges',
			query: {
				broadcaster_id: extractUserId(broadcaster)
			}
		});

		return result.data.map(data => new HelixChatBadgeSet(data));
	}

	/**
	 * Retrieves all global emotes.
	 */
	async getGlobalEmotes(): Promise<HelixEmote[]> {
		const result = await this._client.callApi<HelixResponse<HelixEmoteData>>({
			type: 'helix',
			url: 'chat/emotes/global'
		});

		return result.data.map(data => new HelixEmote(data));
	}

	/**
	 * Retrieves all emotes from a channel.
	 *
	 * @param channel The channel to retrieve emotes from.
	 */
	async getChannelEmotes(channel: UserIdResolvable): Promise<HelixChannelEmote[]> {
		const result = await this._client.callApi<HelixResponse<HelixChannelEmoteData>>({
			type: 'helix',
			url: 'chat/emotes',
			query: {
				broadcaster_id: extractUserId(channel)
			}
		});

		return result.data.map(data => new HelixChannelEmote(data, this._client));
	}

	/**
	 * Retrieves all emotes from a list of emote sets.
	 *
	 * @param setIds The IDs of the emote sets to retrieve emotes from.
	 */
	async getEmotesFromSets(setIds: string[]): Promise<HelixEmoteFromSet[]> {
		const result = await this._client.callApi<HelixResponse<HelixEmoteFromSetData>>({
			type: 'helix',
			url: 'chat/emotes/set',
			query: {
				emote_set_id: setIds
			}
		});

		return result.data.map(data => new HelixEmoteFromSet(data, this._client));
	}

	/**
	 * Retrieves the settings of a broadcaster's chat.
	 *
	 * @param broadcaster The broadcaster the chat belongs to.
	 */
	async getChatSettings(broadcaster: UserIdResolvable): Promise<HelixChatSettings> {
		const result = await this._client.callApi<HelixResponse<HelixChatSettingsData>>({
			type: 'helix',
			url: 'chat/settings',
			query: {
				broadcaster_id: extractUserId(broadcaster)
			}
		});

		return new HelixChatSettings(result.data[0]);
	}

	/**
	 * Retrieves the settings of a broadcaster's chat, including the delay settings.
	 *
	 * @param broadcaster The broadcaster the chat belongs to.
	 * @param moderator The moderator the request is on behalf of.
	 *
	 * This is the user your user token needs to represent.
	 * You can get your own settings by setting `broadcaster` and `moderator` to the same user.
	 */
	async getChatSettingsPrivileged(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable
	): Promise<HelixPrivilegedChatSettings> {
		const result = await this._client.callApi<HelixResponse<HelixPrivilegedChatSettingsData>>({
			type: 'helix',
			url: 'chat/settings',
			scope: 'moderator:read:chat_settings',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				moderator_id: extractUserId(moderator)
			}
		});

		return new HelixPrivilegedChatSettings(result.data[0]);
	}

	/**
	 * Updates the settings of a broadcaster's chat.
	 *
	 * @expandParams
	 *
	 * @param broadcaster The broadcaster the chat belongs to.
	 * @param moderator The moderator the request is on behalf of.
	 *
	 * This is the user your user token needs to represent.
	 * You can get your own settings by setting `broadcaster` and `moderator` to the same user.
	 * @param settings The settings to change.
	 */
	async updateChatSettings(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		settings: HelixUpdateChatSettingsParams
	): Promise<HelixPrivilegedChatSettings> {
		const result = await this._client.callApi<HelixResponse<HelixPrivilegedChatSettingsData>>({
			type: 'helix',
			url: 'chat/settings',
			method: 'PATCH',
			scope: 'moderator:manage:chat_settings',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				moderator_id: extractUserId(moderator)
			},
			jsonBody: {
				slow_mode: settings.slowModeEnabled,
				slow_mode_wait_time: settings.slowModeDelay,
				follower_mode: settings.followerOnlyModeEnabled,
				follower_mode_duration: settings.followerOnlyModeDelay,
				subscriber_mode: settings.subscriberOnlyModeEnabled,
				emote_mode: settings.emoteOnlyModeEnabled,
				unique_chat_mode: settings.uniqueChatModeEnabled,
				non_moderator_chat_delay: settings.nonModeratorChatDelayEnabled,
				non_moderator_chat_delay_duration: settings.nonModeratorChatDelay
			}
		});

		return new HelixPrivilegedChatSettings(result.data[0]);
	}
}
