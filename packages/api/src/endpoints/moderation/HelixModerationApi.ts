import type { HelixPaginatedResponse, HelixResponse } from '@twurple/api-call';
import { createBroadcasterQuery } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { createModeratorActionQuery, createSingleKeyQuery } from '../../interfaces/endpoints/generic.external';
import {
	createAutoModProcessBody,
	createAutoModSettingsBody,
	createBanUserBody,
	createModerationUserListQuery,
	createModeratorModifyQuery,
	createUpdateShieldModeStatusBody,
	type HelixAutoModSettingsData,
	type HelixAutoModStatusData,
	type HelixBanData,
	type HelixBanUserData,
	type HelixBlockedTermData,
	type HelixModeratorData,
	type HelixShieldModeStatusData
} from '../../interfaces/endpoints/moderation.external';
import {
	type HelixAutoModSettingsUpdate,
	type HelixBanFilter,
	type HelixBanUserRequest,
	type HelixCheckAutoModStatusData,
	type HelixModeratorFilter
} from '../../interfaces/endpoints/moderation.input';
import { HelixPaginatedRequest } from '../../utils/pagination/HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../../utils/pagination/HelixPaginatedResult';
import { createPaginatedResult } from '../../utils/pagination/HelixPaginatedResult';
import type { HelixForwardPagination } from '../../utils/pagination/HelixPagination';
import { createPaginationQuery } from '../../utils/pagination/HelixPagination';
import { BaseApi } from '../BaseApi';
import { HelixAutoModSettings } from './HelixAutoModSettings';
import { HelixAutoModStatus } from './HelixAutoModStatus';
import { HelixBan } from './HelixBan';
import { HelixBanUser } from './HelixBanUser';
import { HelixBlockedTerm } from './HelixBlockedTerm';
import { HelixModerator } from './HelixModerator';
import { HelixShieldModeStatus } from './HelixShieldModeStatus';

/**
 * The Helix API methods that deal with moderation.
 *
 * Can be accessed using `client.moderation` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient({ authProvider });
 * const { data: users } = await api.moderation.getBannedUsers('61369223');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Moderation
 */
@rtfm('api', 'HelixModerationApi')
export class HelixModerationApi extends BaseApi {
	/**
	 * Gets a list of banned users in a given channel.
	 *
	 * @param channel The channel to get the banned users from.
	 * @param filter Additional filters for the result set.
	 *
	 * @expandParams
	 */
	async getBannedUsers(channel: UserIdResolvable, filter?: HelixBanFilter): Promise<HelixPaginatedResult<HelixBan>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixBanData>>({
			type: 'helix',
			url: 'moderation/banned',
			userId: extractUserId(channel),
			scopes: ['moderation:read'],
			query: {
				...createModerationUserListQuery(channel, filter),
				...createPaginationQuery(filter)
			}
		});

		return createPaginatedResult(result, HelixBan, this._client);
	}

	/**
	 * Creates a paginator for banned users in a given channel.
	 *
	 * @param channel The channel to get the banned users from.
	 */
	getBannedUsersPaginated(channel: UserIdResolvable): HelixPaginatedRequest<HelixBanData, HelixBan> {
		return new HelixPaginatedRequest(
			{
				url: 'moderation/banned',
				userId: extractUserId(channel),
				scopes: ['moderation:read'],
				query: createBroadcasterQuery(channel)
			},
			this._client,
			data => new HelixBan(data, this._client),
			50 // possibly a relatively consistent workaround for twitchdev/issues#18
		);
	}

	/**
	 * Checks whether a given user is banned in a given channel.
	 *
	 * @param channel The channel to check for a ban of the given user.
	 * @param user The user to check for a ban in the given channel.
	 */
	async checkUserBan(channel: UserIdResolvable, user: UserIdResolvable): Promise<boolean> {
		const userId = extractUserId(user);
		const result = await this.getBannedUsers(channel, { userId });

		return result.data.some(ban => ban.userId === userId);
	}

	/**
	 * Gets a list of moderators in a given channel.
	 *
	 * @param channel The channel to get moderators from.
	 * @param filter Additional filters for the result set.
	 *
	 * @expandParams
	 */
	async getModerators(
		channel: UserIdResolvable,
		filter?: HelixModeratorFilter
	): Promise<HelixPaginatedResult<HelixModerator>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixModeratorData>>({
			type: 'helix',
			url: 'moderation/moderators',
			userId: extractUserId(channel),
			scopes: ['moderation:read', 'channel:manage:moderators'],
			query: {
				...createModerationUserListQuery(channel, filter),
				...createPaginationQuery(filter)
			}
		});

		return createPaginatedResult(result, HelixModerator, this._client);
	}

	/**
	 * Creates a paginator for moderators in a given channel.
	 *
	 * @param channel The channel to get moderators from.
	 */
	getModeratorsPaginated(channel: UserIdResolvable): HelixPaginatedRequest<HelixModeratorData, HelixModerator> {
		return new HelixPaginatedRequest<HelixModeratorData, HelixModerator>(
			{
				url: 'moderation/moderators',
				userId: extractUserId(channel),
				scopes: ['moderation:read', 'channel:manage:moderators'],
				query: createBroadcasterQuery(channel)
			},
			this._client,
			data => new HelixModerator(data, this._client)
		);
	}

	/**
	 * Checks whether a given user is a moderator of a given channel.
	 *
	 * @param channel The channel to check.
	 * @param user The user to check.
	 */
	async checkUserMod(channel: UserIdResolvable, user: UserIdResolvable): Promise<boolean> {
		const userId = extractUserId(user);
		const result = await this.getModerators(channel, { userId });

		return result.data.some(mod => mod.userId === userId);
	}

	/**
	 * Adds a moderator to the broadcaster’s chat room.
	 *
	 * @param broadcaster The broadcaster that owns the chat room. This ID must match the user ID in the access token.
	 * @param user The user to add as a moderator in the broadcaster’s chat room.
	 */
	async addModerator(broadcaster: UserIdResolvable, user: UserIdResolvable): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'moderation/moderators',
			method: 'POST',
			userId: extractUserId(broadcaster),
			scopes: ['channel:manage:moderators'],
			query: createModeratorModifyQuery(broadcaster, user)
		});
	}

	/**
	 * Removes a moderator from the broadcaster’s chat room.
	 *
	 * @param broadcaster The broadcaster that owns the chat room. This ID must match the user ID in the access token.
	 * @param user The user to remove as a moderator from the broadcaster’s chat room.
	 */
	async removeModerator(broadcaster: UserIdResolvable, user: UserIdResolvable): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'moderation/moderators',
			method: 'DELETE',
			userId: extractUserId(broadcaster),
			scopes: ['channel:manage:moderators'],
			query: createModeratorModifyQuery(broadcaster, user)
		});
	}

	/**
	 * Determines whether a string message meets the channel's AutoMod requirements.
	 *
	 * @param channel The channel in which the messages to check are posted.
	 * @param data An array of message data objects.
	 */
	async checkAutoModStatus(
		channel: UserIdResolvable,
		data: HelixCheckAutoModStatusData[]
	): Promise<HelixAutoModStatus[]> {
		const result = await this._client.callApi<HelixResponse<HelixAutoModStatusData>>({
			type: 'helix',
			url: 'moderation/enforcements/status',
			method: 'POST',
			userId: extractUserId(channel),
			scopes: ['moderation:read'],
			query: createBroadcasterQuery(channel),
			jsonBody: {
				data
			}
		});

		return result.data.map(statusData => new HelixAutoModStatus(statusData));
	}

	/**
	 * Processes a message held by AutoMod.
	 *
	 * @param user The user who is processing the message.
	 * @param msgId The ID of the message.
	 * @param allow Whether to allow the message - `true` allows, and `false` denies.
	 */
	async processHeldAutoModMessage(user: UserIdResolvable, msgId: string, allow: boolean): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'moderation/automod/message',
			method: 'POST',
			userId: extractUserId(user),
			scopes: ['moderator:manage:automod'],
			jsonBody: createAutoModProcessBody(user, msgId, allow)
		});
	}

	/**
	 * Gets the AutoMod settings for a broadcaster.
	 *
	 * @param broadcaster The broadcaster to get the AutoMod settings for.
	 * @param moderator A user that has permission to moderate the broadcaster's chat room.
	 * The token of this user will be used to get the settings.
	 */
	async getAutoModSettings(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable
	): Promise<HelixAutoModSettings[]> {
		const result = await this._client.callApi<HelixResponse<HelixAutoModSettingsData>>({
			type: 'helix',
			url: 'moderation/automod/settings',
			userId: extractUserId(moderator),
			scopes: ['moderator:read:automod_settings'],
			query: createModeratorActionQuery(broadcaster, moderator)
		});

		return result.data.map(data => new HelixAutoModSettings(data));
	}

	/**
	 * Updates the AutoMod settings for a broadcaster.
	 *
	 * @param broadcaster The broadcaster for which the AutoMod settings are updated.
	 * @param moderator A user that has permission to moderate the broadcaster's chat room.
	 * The token of this user will be used to update the settings.
	 * @param data The updated AutoMod settings that replace the current AutoMod settings.
	 */
	async updateAutoModSettings(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		data: HelixAutoModSettingsUpdate
	): Promise<HelixAutoModSettings[]> {
		const result = await this._client.callApi<HelixResponse<HelixAutoModSettingsData>>({
			type: 'helix',
			url: 'moderation/automod/settings',
			method: 'PUT',
			userId: extractUserId(moderator),
			scopes: ['moderator:manage:automod_settings'],
			query: createModeratorActionQuery(broadcaster, moderator),
			jsonBody: createAutoModSettingsBody(data)
		});

		return result.data.map(settingsData => new HelixAutoModSettings(settingsData));
	}

	/**
	 * Bans or times out a user in a channel
	 *
	 * @param broadcaster The broadcaster in whose channel the user will be banned/timed out.
	 * @param moderator A user that has permission to ban/timeout users in the broadcaster's chat room.
	 * The token of this user will be used to ban the user.
	 * @param data
	 *
	 * @expandParams
	 *
	 * @returns The result data from the ban/timeout request.
	 */
	async banUser(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		data: HelixBanUserRequest
	): Promise<HelixBanUser[]> {
		const result = await this._client.callApi<HelixResponse<HelixBanUserData>>({
			type: 'helix',
			url: 'moderation/bans',
			method: 'POST',
			userId: extractUserId(moderator),
			scopes: ['moderator:manage:banned_users'],
			query: createModeratorActionQuery(broadcaster, moderator),
			jsonBody: createBanUserBody(data)
		});

		return result.data.map(banData => new HelixBanUser(banData, banData.end_time, this._client));
	}

	/**
	 * Unbans/removes the timeout for a user in a channel.
	 *
	 * @param broadcaster The broadcaster in whose channel the user will be unbanned/removed from timeout.
	 * @param moderator A user that has permission to unban/remove timeout users in the broadcaster's chat room.
	 * The token of this user will be used to unban the user.
	 * @param user The user who will be unbanned/removed from timeout.
	 */
	async unbanUser(broadcaster: UserIdResolvable, moderator: UserIdResolvable, user: UserIdResolvable): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'moderation/bans',
			method: 'DELETE',
			userId: extractUserId(moderator),
			scopes: ['moderator:manage:banned_users'],
			query: {
				...createModeratorActionQuery(broadcaster, moderator),
				...createSingleKeyQuery('user_id', extractUserId(user))
			}
		});
	}

	/**
	 * Gets the broadcaster’s list of non-private, blocked words or phrases.
	 *
	 * @param broadcaster The broadcaster to get their channel's blocked terms for.
	 * @param moderator A user that has permission to get blocked terms for the broadcaster's channel.
	 * The token of this user will be used to get the blocked terms.
	 * @param pagination
	 *
	 * @expandParams
	 *
	 * @returns A paginated list of blocked term data in the broadcaster's channel.
	 */
	async getBlockedTerms(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		pagination?: HelixForwardPagination
	): Promise<HelixPaginatedResult<HelixBlockedTerm>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixBlockedTermData>>({
			type: 'helix',
			url: 'moderation/blocked_terms',
			userId: extractUserId(moderator),
			scopes: ['moderator:read:blocked_terms'],
			query: {
				...createModeratorActionQuery(broadcaster, moderator),
				...createPaginationQuery(pagination)
			}
		});

		return createPaginatedResult(result, HelixBlockedTerm, this._client);
	}

	/**
	 * Adds a blocked term to the broadcaster's channel.
	 *
	 * @param broadcaster The broadcaster in whose channel the term will be blocked.
	 * @param moderator A user that has permission to block terms in the broadcaster's channel.
	 * The token of this user will be used to add the blocked term.
	 * @param text The word or phrase to block from being used in the broadcaster's channel.
	 *
	 * @returns Information about the term that has been blocked.
	 */
	async addBlockedTerm(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		text: string
	): Promise<HelixBlockedTerm[]> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixBlockedTermData>>({
			type: 'helix',
			url: 'moderation/blocked_terms',
			method: 'POST',
			userId: extractUserId(moderator),
			scopes: ['moderator:manage:blocked_terms'],
			query: createModeratorActionQuery(broadcaster, moderator),
			jsonBody: {
				text
			}
		});

		return result.data.map(blockedTermData => new HelixBlockedTerm(blockedTermData));
	}

	/**
	 * Removes a blocked term from the broadcaster's channel.
	 *
	 * @param broadcaster The broadcaster in whose channel the term will be unblocked.
	 * @param moderator A user that has permission to unblock terms in the broadcaster's channel.
	 * The token of this user will be used to remove the blocked term.
	 * @param id The ID of the term that should be unblocked.
	 */
	async removeBlockedTerm(broadcaster: UserIdResolvable, moderator: UserIdResolvable, id: string): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'moderation/blocked_terms',
			method: 'DELETE',
			userId: extractUserId(moderator),
			scopes: ['moderator:manage:blocked_terms'],
			query: {
				...createModeratorActionQuery(broadcaster, moderator),
				id
			}
		});
	}

	/**
	 * Removes a single chat message or all chat messages from the broadcaster’s chat room.
	 *
	 * @param broadcaster The broadcaster the chat belongs to.
	 * @param moderator The moderator the request is on behalf of.
	 *
	 * This is the user your user token needs to represent.
	 * You can delete messages from your own chat room by setting `broadcaster` and `moderator` to the same user.
	 * @param messageId The ID of the message to remove. If not specified, the request removes all messages in the broadcaster’s chat room.
	 */
	async deleteChatMessages(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		messageId?: string
	): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'moderation/chat',
			method: 'DELETE',
			userId: extractUserId(moderator),
			scopes: ['moderator:manage:chat_messages'],
			query: {
				...createModeratorActionQuery(broadcaster, moderator),
				...createSingleKeyQuery('message_id', messageId)
			}
		});
	}

	/**
	 * Gets the broadcaster's Shield Mode activation status.
	 *
	 * @param broadcaster The broadcaster whose Shield Mode activation status you want to get.
	 * @param moderator A user that has permission to read the Shield Mode status in the broadcaster's channel.
	 * The token of this user will be used to get the Shield Mode status.
	 */
	async getShieldModeStatus(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable
	): Promise<HelixShieldModeStatus> {
		const result = await this._client.callApi<HelixResponse<HelixShieldModeStatusData>>({
			type: 'helix',
			url: 'moderation/shield_mode',
			method: 'GET',
			userId: extractUserId(moderator),
			scopes: ['moderator:read:shield_mode', 'moderator:manage:shield_mode'],
			query: createModeratorActionQuery(broadcaster, moderator)
		});

		return new HelixShieldModeStatus(result.data[0], this._client);
	}

	/**
	 * Activates or deactivates the broadcaster's Shield Mode.
	 *
	 * @param broadcaster The broadcaster whose Shield Mode you want to activate or deactivate.
	 * @param moderator A user that has permission to update Shield Mode status in the broadcaster's channel.
	 * The token of this user will be used to change the Shield Mode status.
	 * @param activate The desired Shield Mode status on the broadcaster's channel.
	 */
	async updateShieldModeStatus(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		activate: boolean
	): Promise<HelixShieldModeStatus> {
		const result = await this._client.callApi<HelixResponse<HelixShieldModeStatusData>>({
			type: 'helix',
			url: 'moderation/shield_mode',
			method: 'PUT',
			userId: extractUserId(moderator),
			scopes: ['moderator:manage:shield_mode'],
			query: createModeratorActionQuery(broadcaster, moderator),
			jsonBody: createUpdateShieldModeStatusBody(activate)
		});

		return new HelixShieldModeStatus(result.data[0], this._client);
	}
}
