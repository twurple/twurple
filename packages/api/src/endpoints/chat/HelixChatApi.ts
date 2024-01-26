import { createBroadcasterQuery, type HelixResponse } from '@twurple/api-call';
import { extractUserId, rtfm, type UserIdResolvable } from '@twurple/common';
import {
	createChatColorUpdateQuery,
	createChatSettingsUpdateBody,
	createSendChatMessageQuery,
	createSendChatMessageBody,
	createShoutoutQuery,
	type HelixChannelEmoteData,
	type HelixChatBadgeSetData,
	type HelixChatChatterData,
	type HelixChatColorDefinitionData,
	type HelixChatSettingsData,
	type HelixChatUserColor,
	type HelixEmoteData,
	type HelixEmoteFromSetData,
	type HelixPrivilegedChatSettingsData,
	type HelixSentChatMessageData,
} from '../../interfaces/endpoints/chat.external';
import {
	type HelixSendChatMessageParams,
	type HelixSendChatAnnouncementParams,
	type HelixUpdateChatSettingsParams,
} from '../../interfaces/endpoints/chat.input';
import { createModeratorActionQuery, createSingleKeyQuery } from '../../interfaces/endpoints/generic.external';
import { HelixPaginatedRequestWithTotal } from '../../utils/pagination/HelixPaginatedRequestWithTotal';
import {
	createPaginatedResultWithTotal,
	type HelixPaginatedResultWithTotal,
} from '../../utils/pagination/HelixPaginatedResult';
import { createPaginationQuery, type HelixForwardPagination } from '../../utils/pagination/HelixPagination';
import { BaseApi } from '../BaseApi';
import { HelixChannelEmote } from './HelixChannelEmote';
import { HelixChatBadgeSet } from './HelixChatBadgeSet';
import { HelixChatChatter } from './HelixChatChatter';
import { HelixChatSettings } from './HelixChatSettings';
import { HelixEmote } from './HelixEmote';
import { HelixEmoteFromSet } from './HelixEmoteFromSet';
import { HelixPrivilegedChatSettings } from './HelixPrivilegedChatSettings';
import { HelixSentChatMessage } from './HelixSentChatMessage';

/**
 * The Helix API methods that deal with chat.
 *
 * Can be accessed using `client.chat` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient({ authProvider });
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
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @param broadcaster The broadcaster whose list of chatters you want to get.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getChatters(
		broadcaster: UserIdResolvable,
		pagination?: HelixForwardPagination,
	): Promise<HelixPaginatedResultWithTotal<HelixChatChatter>> {
		const broadcasterId = extractUserId(broadcaster);
		const result = await this._client.callApi<HelixPaginatedResultWithTotal<HelixChatChatterData>>({
			type: 'helix',
			url: 'chat/chatters',
			userId: broadcasterId,
			canOverrideScopedUserContext: true,
			scopes: ['moderator:read:chatters'],
			query: {
				...this._createModeratorActionQuery(broadcasterId),
				...createPaginationQuery(pagination),
			},
		});

		return createPaginatedResultWithTotal(result, HelixChatChatter, this._client);
	}

	/**
	 * Creates a paginator for users that are connected to the broadcaster’s chat session.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @param broadcaster The broadcaster whose list of chatters you want to get.
	 *
	 * @expandParams
	 */
	getChattersPaginated(
		broadcaster: UserIdResolvable,
	): HelixPaginatedRequestWithTotal<HelixChatChatterData, HelixChatChatter> {
		const broadcasterId = extractUserId(broadcaster);
		return new HelixPaginatedRequestWithTotal<HelixChatChatterData, HelixChatChatter>(
			{
				url: 'chat/chatters',
				userId: broadcasterId,
				canOverrideScopedUserContext: true,
				scopes: ['moderator:read:chatters'],
				query: this._createModeratorActionQuery(broadcasterId),
			},
			this._client,
			data => new HelixChatChatter(data, this._client),
		);
	}

	/**
	 * Gets all global badges.
	 */
	async getGlobalBadges(): Promise<HelixChatBadgeSet[]> {
		const result = await this._client.callApi<HelixResponse<HelixChatBadgeSetData>>({
			type: 'helix',
			url: 'chat/badges/global',
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
			query: createBroadcasterQuery(broadcaster),
		});

		return result.data.map(data => new HelixChatBadgeSet(data));
	}

	/**
	 * Gets all global emotes.
	 */
	async getGlobalEmotes(): Promise<HelixEmote[]> {
		const result = await this._client.callApi<HelixResponse<HelixEmoteData>>({
			type: 'helix',
			url: 'chat/emotes/global',
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
			query: createBroadcasterQuery(broadcaster),
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
			query: createSingleKeyQuery('emote_set_id', setIds),
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
			query: createBroadcasterQuery(broadcaster),
		});

		return new HelixChatSettings(result.data[0]);
	}

	/**
	 * Gets the settings of a broadcaster's chat, including the delay settings.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @param broadcaster The broadcaster the chat belongs to.
	 */
	async getSettingsPrivileged(broadcaster: UserIdResolvable): Promise<HelixPrivilegedChatSettings> {
		const broadcasterId = extractUserId(broadcaster);
		const result = await this._client.callApi<HelixResponse<HelixPrivilegedChatSettingsData>>({
			type: 'helix',
			url: 'chat/settings',
			userId: broadcasterId,
			canOverrideScopedUserContext: true,
			scopes: ['moderator:read:chat_settings'],
			query: this._createModeratorActionQuery(broadcasterId),
		});

		return new HelixPrivilegedChatSettings(result.data[0]);
	}

	/**
	 * Updates the settings of a broadcaster's chat.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @expandParams
	 *
	 * @param broadcaster The broadcaster the chat belongs to.
	 * @param settings The settings to change.
	 */
	async updateSettings(
		broadcaster: UserIdResolvable,
		settings: HelixUpdateChatSettingsParams,
	): Promise<HelixPrivilegedChatSettings> {
		const broadcasterId = extractUserId(broadcaster);
		const result = await this._client.callApi<HelixResponse<HelixPrivilegedChatSettingsData>>({
			type: 'helix',
			url: 'chat/settings',
			method: 'PATCH',
			userId: broadcasterId,
			canOverrideScopedUserContext: true,
			scopes: ['moderator:manage:chat_settings'],
			query: this._createModeratorActionQuery(broadcasterId),
			jsonBody: createChatSettingsUpdateBody(settings),
		});

		return new HelixPrivilegedChatSettings(result.data[0]);
	}

	/**
	 * Sends a chat message to a broadcaster's chat.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @expandParams
	 *
	 * @param broadcaster The broadcaster the chat belongs to.
	 * @param message The message to send.
	 * @param params
	 */
	async sendChatMessage(
		broadcaster: UserIdResolvable,
		message: string,
		params: HelixSendChatMessageParams,
	): Promise<HelixSentChatMessage> {
		const broadcasterId = extractUserId(broadcaster);
		const result = await this._client.callApi<HelixResponse<HelixSentChatMessageData>>({
			type: 'helix',
			url: 'chat/messages',
			method: 'POST',
			userId: broadcasterId,
			canOverrideScopedUserContext: true,
			scopes: ['user:write:chat'],
			query: createSendChatMessageQuery(broadcasterId, this._getUserContextIdWithDefault(broadcasterId)),
			jsonBody: createSendChatMessageBody(message, params),
		});

		return new HelixSentChatMessage(result.data[0]);
	}

	/**
	 * Sends an announcement to a broadcaster's chat.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @param broadcaster The broadcaster the chat belongs to.
	 * @param announcement The announcement to send.
	 */
	async sendAnnouncement(
		broadcaster: UserIdResolvable,
		announcement: HelixSendChatAnnouncementParams,
	): Promise<void> {
		const broadcasterId = extractUserId(broadcaster);
		await this._client.callApi({
			type: 'helix',
			url: 'chat/announcements',
			method: 'POST',
			userId: broadcasterId,
			canOverrideScopedUserContext: true,
			scopes: ['moderator:manage:announcements'],
			query: this._createModeratorActionQuery(broadcasterId),
			jsonBody: {
				message: announcement.message,
				color: announcement.color,
			},
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
			query: createSingleKeyQuery('user_id', users.map(extractUserId)),
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
			query: createSingleKeyQuery('user_id', extractUserId(user)),
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
			query: createChatColorUpdateQuery(user, color),
		});
	}

	/**
	 * Sends a shoutout to the specified broadcaster.
	 * The broadcaster may send a shoutout once every 2 minutes. They may send the same broadcaster a shoutout once every 60 minutes.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @param from The ID of the broadcaster that’s sending the shoutout.
	 * @param to The ID of the broadcaster that’s receiving the shoutout.
	 */
	async shoutoutUser(from: UserIdResolvable, to: UserIdResolvable): Promise<void> {
		const fromId = extractUserId(from);
		await this._client.callApi({
			type: 'helix',
			url: 'chat/shoutouts',
			method: 'POST',
			userId: fromId,
			canOverrideScopedUserContext: true,
			scopes: ['moderator:manage:shoutouts'],
			query: createShoutoutQuery(from, to, this._getUserContextIdWithDefault(fromId)),
		});
	}

	private _createModeratorActionQuery(broadcasterId: string) {
		return createModeratorActionQuery(broadcasterId, this._getUserContextIdWithDefault(broadcasterId));
	}
}
