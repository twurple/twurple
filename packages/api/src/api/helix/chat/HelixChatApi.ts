import type { HelixResponse } from '@twurple/api-call';
import { createBroadcasterQuery } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import {
	createChatColorUpdateQuery,
	createChatSettingsUpdateBody,
	createShoutoutQuery,
	type HelixChannelEmoteData,
	type HelixChatBadgeSetData,
	type HelixChatChatterData,
	type HelixChatColorDefinitionData,
	type HelixChatSettingsData,
	type HelixChatUserColor,
	type HelixEmoteData,
	type HelixEmoteFromSetData,
	type HelixPrivilegedChatSettingsData
} from '../../../interfaces/helix/chat.external';
import {
	type HelixSendChatAnnouncementParams,
	type HelixUpdateChatSettingsParams
} from '../../../interfaces/helix/chat.input';
import { createModeratorActionQuery, createSingleKeyQuery } from '../../../interfaces/helix/generic.external';
import { BaseApi } from '../../BaseApi';
import { createPaginatedResultWithTotal, type HelixPaginatedResultWithTotal } from '../HelixPaginatedResult';
import { createPaginationQuery, type HelixForwardPagination } from '../HelixPagination';
import { HelixChannelEmote } from './HelixChannelEmote';
import { HelixChatBadgeSet } from './HelixChatBadgeSet';
import { HelixChatChatter } from './HelixChatChatter';
import { HelixChatSettings } from './HelixChatSettings';
import { HelixEmote } from './HelixEmote';
import { HelixEmoteFromSet } from './HelixEmoteFromSet';
import { HelixPrivilegedChatSettings } from './HelixPrivilegedChatSettings';

/**
 * The Helix API methods that deal with chat.
 *
 * Can be accessed using `client.chat` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const rewards = await api.chat.getChannelBadges('125328655');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Chat
 */
@rtfm('api', 'HelixChatApi')
export class HelixChatApi extends BaseApi {
	/**
	 * Gets the list of users that are connected to the broadcaster’s chat session.
	 *
	 * @param broadcaster The broadcaster whose list of chatters you want to get.
	 * @param moderator The broadcaster or one of the broadcaster’s moderators.
	 * The token of this user will be used to fetch the chatters.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getChatters(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		pagination?: HelixForwardPagination
	): Promise<HelixPaginatedResultWithTotal<HelixChatChatter>> {
		const result = await this._client.callApi<HelixPaginatedResultWithTotal<HelixChatChatterData>>({
			type: 'helix',
			url: 'chat/chatters',
			userId: extractUserId(moderator),
			scopes: ['moderator:read:chatters'],
			query: {
				...createModeratorActionQuery(broadcaster, moderator),
				...createPaginationQuery(pagination)
			}
		});

		return createPaginatedResultWithTotal(result, HelixChatChatter, this._client);
	}

	/**
	 * Gets all global badges.
	 */
	async getGlobalBadges(): Promise<HelixChatBadgeSet[]> {
		const result = await this._client.callApi<HelixResponse<HelixChatBadgeSetData>>({
			type: 'helix',
			url: 'chat/badges/global'
		});

		return result.data.map(data => new HelixChatBadgeSet(data));
	}

	/**
	 * Gets all badges specific to the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to get badges for.
	 */
	async getChannelBadges(broadcaster: UserIdResolvable): Promise<HelixChatBadgeSet[]> {
		const result = await this._client.callApi<HelixResponse<HelixChatBadgeSetData>>({
			type: 'helix',
			url: 'chat/badges',
			userId: extractUserId(broadcaster),
			query: createBroadcasterQuery(broadcaster)
		});

		return result.data.map(data => new HelixChatBadgeSet(data));
	}

	/**
	 * Gets all global emotes.
	 */
	async getGlobalEmotes(): Promise<HelixEmote[]> {
		const result = await this._client.callApi<HelixResponse<HelixEmoteData>>({
			type: 'helix',
			url: 'chat/emotes/global'
		});

		return result.data.map(data => new HelixEmote(data));
	}

	/**
	 * Gets all emotes specific to the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to get emotes for.
	 */
	async getChannelEmotes(broadcaster: UserIdResolvable): Promise<HelixChannelEmote[]> {
		const result = await this._client.callApi<HelixResponse<HelixChannelEmoteData>>({
			type: 'helix',
			url: 'chat/emotes',
			userId: extractUserId(broadcaster),
			query: createBroadcasterQuery(broadcaster)
		});

		return result.data.map(data => new HelixChannelEmote(data, this._client));
	}

	/**
	 * Gets all emotes from a list of emote sets.
	 *
	 * @param setIds The IDs of the emote sets to get emotes from.
	 */
	async getEmotesFromSets(setIds: string[]): Promise<HelixEmoteFromSet[]> {
		const result = await this._client.callApi<HelixResponse<HelixEmoteFromSetData>>({
			type: 'helix',
			url: 'chat/emotes/set',
			query: createSingleKeyQuery('emote_set_id', setIds)
		});

		return result.data.map(data => new HelixEmoteFromSet(data, this._client));
	}

	/**
	 * Gets the settings of a broadcaster's chat.
	 *
	 * @param broadcaster The broadcaster the chat belongs to.
	 */
	async getSettings(broadcaster: UserIdResolvable): Promise<HelixChatSettings> {
		const result = await this._client.callApi<HelixResponse<HelixChatSettingsData>>({
			type: 'helix',
			url: 'chat/settings',
			userId: extractUserId(broadcaster),
			query: createBroadcasterQuery(broadcaster)
		});

		return new HelixChatSettings(result.data[0]);
	}

	/**
	 * Gets the settings of a broadcaster's chat, including the delay settings.
	 *
	 * @param broadcaster The broadcaster the chat belongs to.
	 * @param moderator The moderator the request is on behalf of.
	 *
	 * This is the user your user token needs to represent.
	 * You can get your own settings by setting `broadcaster` and `moderator` to the same user.
	 */
	async getSettingsPrivileged(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable
	): Promise<HelixPrivilegedChatSettings> {
		const result = await this._client.callApi<HelixResponse<HelixPrivilegedChatSettingsData>>({
			type: 'helix',
			url: 'chat/settings',
			userId: extractUserId(moderator),
			scopes: ['moderator:read:chat_settings'],
			query: createModeratorActionQuery(broadcaster, moderator)
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
	async updateSettings(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		settings: HelixUpdateChatSettingsParams
	): Promise<HelixPrivilegedChatSettings> {
		const result = await this._client.callApi<HelixResponse<HelixPrivilegedChatSettingsData>>({
			type: 'helix',
			url: 'chat/settings',
			method: 'PATCH',
			userId: extractUserId(moderator),
			scopes: ['moderator:manage:chat_settings'],
			query: createModeratorActionQuery(broadcaster, moderator),
			jsonBody: createChatSettingsUpdateBody(settings)
		});

		return new HelixPrivilegedChatSettings(result.data[0]);
	}

	/**
	 * Sends an announcement to a broadcaster's chat.
	 *
	 * @param broadcaster The broadcaster the chat belongs to.
	 * @param moderator The moderator the request is on behalf of.
	 *
	 * This is the user your user token needs to represent.
	 * You can send an announcement to your own chat by setting `broadcaster` and `moderator` to the same user.
	 * @param announcement The announcement to send.
	 */
	async sendAnnouncement(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		announcement: HelixSendChatAnnouncementParams
	): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'chat/announcements',
			method: 'POST',
			userId: extractUserId(moderator),
			scopes: ['moderator:manage:announcements'],
			query: createModeratorActionQuery(broadcaster, moderator),
			jsonBody: {
				message: announcement.message,
				color: announcement.color
			}
		});
	}

	/**
	 * Gets the chat colors for a list of users.
	 *
	 * Returns a Map with user IDs as keys and their colors as values.
	 * The value is a color hex code, or `null` if the user did not set a color,
	 * and unknown users will not be present in the map.
	 *
	 * @param users The users to get the chat colors of.
	 */
	async getColorsForUsers(users: UserIdResolvable[]): Promise<Map<string, string | null>> {
		const response = await this._client.callApi<HelixResponse<HelixChatColorDefinitionData>>({
			type: 'helix',
			url: 'chat/color',
			query: createSingleKeyQuery('user_id', users.map(extractUserId))
		});

		return new Map(response.data.map(data => [data.user_id, data.color || null] as const));
	}

	/**
	 * Gets the chat color for a user.
	 *
	 * Returns the color as hex code, `null` if the user did not set a color, or `undefined` if the user is unknown.
	 *
	 * @param user The user to get the chat color of.
	 */
	async getColorForUser(user: UserIdResolvable): Promise<string | null | undefined> {
		const response = await this._client.callApi<HelixResponse<HelixChatColorDefinitionData>>({
			type: 'helix',
			url: 'chat/color',
			userId: extractUserId(user),
			query: createSingleKeyQuery('user_id', extractUserId(user))
		});

		if (!response.data.length) {
			return undefined;
		}

		return response.data[0].color || null;
	}

	/**
	 * Changes the chat color for a user.
	 *
	 * @param user The user to change the color of.
	 * @param color The color to set.
	 *
	 * Note that hex codes can only be used by users that have a Prime or Turbo subscription.
	 */
	async setColorForUser(user: UserIdResolvable, color: HelixChatUserColor): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'chat/color',
			method: 'PUT',
			userId: extractUserId(user),
			scopes: ['user:manage:chat_color'],
			query: createChatColorUpdateQuery(user, color)
		});
	}

	/**
	 * Sends a shoutout to the specified broadcaster.
	 * The broadcaster may send a shoutout once every 2 minutes. They may send the same broadcaster a shoutout once every 60 minutes.
	 *
	 * @param from The ID of the broadcaster that’s sending the shoutout.
	 * @param to The ID of the broadcaster that’s receiving the shoutout.
	 * @param moderator The ID of the broadcaster or a user that is one of the broadcaster’s moderators.
	 * This ID must match the user ID in the access token.
	 */
	async shoutoutUser(from: UserIdResolvable, to: UserIdResolvable, moderator: UserIdResolvable): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'chat/shoutouts',
			method: 'POST',
			userId: extractUserId(moderator),
			scopes: ['moderator:manage:shoutouts'],
			query: createShoutoutQuery(from, to, moderator)
		});
	}
}
