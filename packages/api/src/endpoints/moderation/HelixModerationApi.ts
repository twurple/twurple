import { createBroadcasterQuery, type HelixPaginatedResponse, type HelixResponse } from '@twurple/api-call';
import { extractUserId, rtfm, type UserIdResolvable } from '@twurple/common';
import { createModeratorActionQuery, createSingleKeyQuery } from '../../interfaces/endpoints/generic.external';
import {
	createAutoModProcessBody,
	createAutoModSettingsBody,
	createBanUserBody,
	createCheckAutoModStatusBody,
	createModerationUserListQuery,
	createModeratorModifyQuery,
	createResolveUnbanRequestQuery,
	createUpdateShieldModeStatusBody,
	createWarnUserBody,
	type HelixAutoModSettingsData,
	type HelixAutoModStatusData,
	type HelixBanData,
	type HelixBanUserData,
	type HelixBlockedTermData,
	type HelixModeratedChannelData,
	type HelixModeratorData,
	type HelixShieldModeStatusData,
	type HelixUnbanRequestData,
	type HelixUnbanRequestStatus,
	type HelixWarningData,
} from '../../interfaces/endpoints/moderation.external';
import {
	type HelixAutoModSettingsUpdate,
	type HelixBanFilter,
	type HelixBanUserRequest,
	type HelixCheckAutoModStatusData,
	type HelixModeratorFilter,
	type HelixUnbanRequestFilter,
} from '../../interfaces/endpoints/moderation.input';
import { HelixPaginatedRequest } from '../../utils/pagination/HelixPaginatedRequest';
import { createPaginatedResult, type HelixPaginatedResult } from '../../utils/pagination/HelixPaginatedResult';
import { createPaginationQuery, type HelixForwardPagination } from '../../utils/pagination/HelixPagination';
import { BaseApi } from '../BaseApi';
import { HelixAutoModSettings } from './HelixAutoModSettings';
import { HelixAutoModStatus } from './HelixAutoModStatus';
import { HelixBan } from './HelixBan';
import { HelixBanUser } from './HelixBanUser';
import { HelixBlockedTerm } from './HelixBlockedTerm';
import { HelixModeratedChannel } from './HelixModeratedChannel';
import { HelixModerator } from './HelixModerator';
import { HelixShieldModeStatus } from './HelixShieldModeStatus';
import { HelixUnbanRequest } from './HelixUnbanRequest';
import { HelixWarning } from './HelixWarning';

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
				...createPaginationQuery(filter),
			},
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
				query: createBroadcasterQuery(channel),
			},
			this._client,
			data => new HelixBan(data, this._client),
			50, // possibly a relatively consistent workaround for twitchdev/issues#18
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
		filter?: HelixModeratorFilter,
	): Promise<HelixPaginatedResult<HelixModerator>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixModeratorData>>({
			type: 'helix',
			url: 'moderation/moderators',
			userId: extractUserId(channel),
			scopes: ['moderation:read', 'channel:manage:moderators'],
			query: {
				...createModerationUserListQuery(channel, filter),
				...createPaginationQuery(filter),
			},
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
				query: createBroadcasterQuery(channel),
			},
			this._client,
			data => new HelixModerator(data, this._client),
		);
	}

	/**
	 * Gets a list of channels where the specified user has moderator privileges.
	 *
	 * @param user The user for whom to return a list of channels where they have moderator privileges.
	 * This ID must match the user ID in the access token.
	 * @param filter
	 *
	 * @expandParams
	 *
	 * @returns A paginated list of channels where the user has moderator privileges.
	 */
	async getModeratedChannels(
		user: UserIdResolvable,
		filter?: HelixForwardPagination,
	): Promise<HelixPaginatedResult<HelixModeratedChannel>> {
		const userId = extractUserId(user);
		const result = await this._client.callApi<HelixPaginatedResponse<HelixModeratedChannelData>>({
			type: 'helix',
			url: 'moderation/channels',
			userId,
			scopes: ['user:read:moderated_channels'],
			query: {
				...createSingleKeyQuery('user_id', userId),
				...createPaginationQuery(filter),
			},
		});

		return createPaginatedResult(result, HelixModeratedChannel, this._client);
	}

	/**
	 * Creates a paginator for channels where the specified user has moderator privileges.
	 *
	 * @param user The user for whom to return the list of channels where they have moderator privileges.
	 * This ID must match the user ID in the access token.
	 */
	getModeratedChannelsPaginated(
		user: UserIdResolvable,
	): HelixPaginatedRequest<HelixModeratedChannelData, HelixModeratedChannel> {
		const userId = extractUserId(user);
		return new HelixPaginatedRequest<HelixModeratedChannelData, HelixModeratedChannel>(
			{
				url: 'moderation/channels',
				userId,
				scopes: ['user:read:moderated_channels'],
				query: createSingleKeyQuery('user_id', userId),
			},
			this._client,
			data => new HelixModeratedChannel(data, this._client),
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
			query: createModeratorModifyQuery(broadcaster, user),
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
			query: createModeratorModifyQuery(broadcaster, user),
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
		data: HelixCheckAutoModStatusData[],
	): Promise<HelixAutoModStatus[]> {
		const result = await this._client.callApi<HelixResponse<HelixAutoModStatusData>>({
			type: 'helix',
			url: 'moderation/enforcements/status',
			method: 'POST',
			userId: extractUserId(channel),
			scopes: ['moderation:read'],
			query: createBroadcasterQuery(channel),
			jsonBody: createCheckAutoModStatusBody(data),
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
			jsonBody: createAutoModProcessBody(user, msgId, allow),
		});
	}

	/**
	 * Gets the AutoMod settings for a broadcaster.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @param broadcaster The broadcaster to get the AutoMod settings for.
	 */
	async getAutoModSettings(broadcaster: UserIdResolvable): Promise<HelixAutoModSettings[]> {
		const broadcasterId = extractUserId(broadcaster);
		const result = await this._client.callApi<HelixResponse<HelixAutoModSettingsData>>({
			type: 'helix',
			url: 'moderation/automod/settings',
			userId: broadcasterId,
			scopes: ['moderator:read:automod_settings'],
			canOverrideScopedUserContext: true,
			query: this._createModeratorActionQuery(broadcasterId),
		});

		return result.data.map(data => new HelixAutoModSettings(data));
	}

	/**
	 * Updates the AutoMod settings for a broadcaster.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @param broadcaster The broadcaster for which the AutoMod settings are updated.
	 * @param data The updated AutoMod settings that replace the current AutoMod settings.
	 */
	async updateAutoModSettings(
		broadcaster: UserIdResolvable,
		data: HelixAutoModSettingsUpdate,
	): Promise<HelixAutoModSettings[]> {
		const broadcasterId = extractUserId(broadcaster);
		const result = await this._client.callApi<HelixResponse<HelixAutoModSettingsData>>({
			type: 'helix',
			url: 'moderation/automod/settings',
			method: 'PUT',
			userId: broadcasterId,
			scopes: ['moderator:manage:automod_settings'],
			canOverrideScopedUserContext: true,
			query: this._createModeratorActionQuery(broadcasterId),
			jsonBody: createAutoModSettingsBody(data),
		});

		return result.data.map(settingsData => new HelixAutoModSettings(settingsData));
	}

	/**
	 * Bans or times out a user in a channel.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @param broadcaster The broadcaster in whose channel the user will be banned/timed out.
	 * @param data
	 *
	 * @expandParams
	 *
	 * @returns The result data from the ban/timeout request.
	 */
	async banUser(broadcaster: UserIdResolvable, data: HelixBanUserRequest): Promise<HelixBanUser[]> {
		const broadcasterId = extractUserId(broadcaster);
		const result = await this._client.callApi<HelixResponse<HelixBanUserData>>({
			type: 'helix',
			url: 'moderation/bans',
			method: 'POST',
			userId: broadcasterId,
			scopes: ['moderator:manage:banned_users'],
			canOverrideScopedUserContext: true,
			query: this._createModeratorActionQuery(broadcasterId),
			jsonBody: createBanUserBody(data),
		});

		return result.data.map(banData => new HelixBanUser(banData, banData.end_time, this._client));
	}

	/**
	 * Unbans/removes the timeout for a user in a channel.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @param broadcaster The broadcaster in whose channel the user will be unbanned/removed from timeout.
	 * @param user The user who will be unbanned/removed from timeout.
	 */
	async unbanUser(broadcaster: UserIdResolvable, user: UserIdResolvable): Promise<void> {
		const broadcasterId = extractUserId(broadcaster);
		await this._client.callApi({
			type: 'helix',
			url: 'moderation/bans',
			method: 'DELETE',
			userId: broadcasterId,
			scopes: ['moderator:manage:banned_users'],
			canOverrideScopedUserContext: true,
			query: {
				...this._createModeratorActionQuery(broadcasterId),
				...createSingleKeyQuery('user_id', extractUserId(user)),
			},
		});
	}

	/**
	 * Gets the broadcaster’s list of non-private, blocked words or phrases.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @param broadcaster The broadcaster to get their channel's blocked terms for.
	 * @param pagination
	 *
	 * @expandParams
	 *
	 * @returns A paginated list of blocked term data in the broadcaster's channel.
	 */
	async getBlockedTerms(
		broadcaster: UserIdResolvable,
		pagination?: HelixForwardPagination,
	): Promise<HelixPaginatedResult<HelixBlockedTerm>> {
		const broadcasterId = extractUserId(broadcaster);
		const result = await this._client.callApi<HelixPaginatedResponse<HelixBlockedTermData>>({
			type: 'helix',
			url: 'moderation/blocked_terms',
			userId: broadcasterId,
			scopes: ['moderator:read:blocked_terms'],
			canOverrideScopedUserContext: true,
			query: {
				...this._createModeratorActionQuery(broadcasterId),
				...createPaginationQuery(pagination),
			},
		});

		return createPaginatedResult(result, HelixBlockedTerm, this._client);
	}

	/**
	 * Adds a blocked term to the broadcaster's channel.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @param broadcaster The broadcaster in whose channel the term will be blocked.
	 * @param text The word or phrase to block from being used in the broadcaster's channel.
	 *
	 * @returns Information about the term that has been blocked.
	 */
	async addBlockedTerm(broadcaster: UserIdResolvable, text: string): Promise<HelixBlockedTerm[]> {
		const broadcasterId = extractUserId(broadcaster);
		const result = await this._client.callApi<HelixPaginatedResponse<HelixBlockedTermData>>({
			type: 'helix',
			url: 'moderation/blocked_terms',
			method: 'POST',
			userId: broadcasterId,
			scopes: ['moderator:manage:blocked_terms'],
			canOverrideScopedUserContext: true,
			query: this._createModeratorActionQuery(broadcasterId),
			jsonBody: {
				text,
			},
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
		const broadcasterId = extractUserId(broadcaster);
		await this._client.callApi({
			type: 'helix',
			url: 'moderation/blocked_terms',
			method: 'DELETE',
			userId: broadcasterId,
			scopes: ['moderator:manage:blocked_terms'],
			canOverrideScopedUserContext: true,
			query: {
				...this._createModeratorActionQuery(broadcasterId),
				id,
			},
		});
	}

	/**
	 * Removes a single chat message or all chat messages from the broadcaster’s chat room.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @param broadcaster The broadcaster the chat belongs to.
	 * @param messageId The ID of the message to remove. If not specified, the request removes all messages in the broadcaster’s chat room.
	 */
	async deleteChatMessages(broadcaster: UserIdResolvable, messageId?: string): Promise<void> {
		const broadcasterId = extractUserId(broadcaster);
		await this._client.callApi({
			type: 'helix',
			url: 'moderation/chat',
			method: 'DELETE',
			userId: broadcasterId,
			scopes: ['moderator:manage:chat_messages'],
			canOverrideScopedUserContext: true,
			query: {
				...this._createModeratorActionQuery(broadcasterId),
				...createSingleKeyQuery('message_id', messageId),
			},
		});
	}

	/**
	 * Gets the broadcaster's Shield Mode activation status.
	 *
	 * @param broadcaster The broadcaster whose Shield Mode activation status you want to get.
	 */
	async getShieldModeStatus(broadcaster: UserIdResolvable): Promise<HelixShieldModeStatus> {
		const broadcasterId = extractUserId(broadcaster);
		const result = await this._client.callApi<HelixResponse<HelixShieldModeStatusData>>({
			type: 'helix',
			url: 'moderation/shield_mode',
			method: 'GET',
			userId: broadcasterId,
			scopes: ['moderator:read:shield_mode', 'moderator:manage:shield_mode'],
			canOverrideScopedUserContext: true,
			query: this._createModeratorActionQuery(broadcasterId),
		});

		return new HelixShieldModeStatus(result.data[0], this._client);
	}

	/**
	 * Activates or deactivates the broadcaster's Shield Mode.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @param broadcaster The broadcaster whose Shield Mode you want to activate or deactivate.
	 * @param activate The desired Shield Mode status on the broadcaster's channel.
	 */
	async updateShieldModeStatus(broadcaster: UserIdResolvable, activate: boolean): Promise<HelixShieldModeStatus> {
		const broadcasterId = extractUserId(broadcaster);
		const result = await this._client.callApi<HelixResponse<HelixShieldModeStatusData>>({
			type: 'helix',
			url: 'moderation/shield_mode',
			method: 'PUT',
			userId: broadcasterId,
			scopes: ['moderator:manage:shield_mode'],
			canOverrideScopedUserContext: true,
			query: this._createModeratorActionQuery(broadcasterId),
			jsonBody: createUpdateShieldModeStatusBody(activate),
		});

		return new HelixShieldModeStatus(result.data[0], this._client);
	}

	/**
	 * Gets a list of unban requests.
	 *
	 * @param broadcaster The broadcaster to get unban requests of.
	 * @param status The status of unban requests to retrieve.
	 * @param filter Additional filters for the result set.
	 */
	async getUnbanRequests(
		broadcaster: UserIdResolvable,
		status: HelixUnbanRequestStatus,
		filter?: HelixUnbanRequestFilter,
	): Promise<HelixPaginatedResult<HelixUnbanRequest>> {
		const broadcasterId = extractUserId(broadcaster);
		const result = await this._client.callApi<HelixResponse<HelixUnbanRequestData>>({
			type: 'helix',
			url: 'moderation/unban_requests',
			method: 'GET',
			userId: broadcasterId,
			scopes: ['moderator:read:unban_requests', 'moderator:manage:unban_requests'],
			canOverrideScopedUserContext: true,
			query: {
				...this._createModeratorActionQuery(broadcasterId),
				...createSingleKeyQuery('status', status),
				...createPaginationQuery(filter),
			},
		});

		return createPaginatedResult(result, HelixUnbanRequest, this._client);
	}

	/**
	 * Creates a paginator for unban requests.
	 *
	 * @param broadcaster The broadcaster to get unban requests of.
	 * @param status The status of unban requests to retrieve.
	 */
	getUnbanRequestsPaginated(
		broadcaster: UserIdResolvable,
		status: HelixUnbanRequestStatus,
	): HelixPaginatedRequest<HelixUnbanRequestData, HelixUnbanRequest> {
		const broadcasterId = extractUserId(broadcaster);
		return new HelixPaginatedRequest<HelixUnbanRequestData, HelixUnbanRequest>(
			{
				url: 'moderation/unban_requests',
				method: 'GET',
				userId: broadcasterId,
				scopes: ['moderator:read:unban_requests', 'moderator:manage:unban_requests'],
				canOverrideScopedUserContext: true,
				query: {
					...this._createModeratorActionQuery(broadcasterId),
					...createSingleKeyQuery('status', status),
				},
			},
			this._client,
			data => new HelixUnbanRequest(data, this._client),
		);
	}

	/**
	 * Resolves an unban request by approving or denying it.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @param broadcaster The ID of the broadcaster whose channel is approving or denying the unban request.
	 * @param unbanRequestId The ID of the unban request to resolve.
	 * @param approved Whether to approve or deny the unban request.
	 * @param resolutionMessage Message supplied by the unban request resolver.
	 *
	 * The message is limited to a maximum of 500 characters.
	 */
	async resolveUnbanRequest(
		broadcaster: UserIdResolvable,
		unbanRequestId: string,
		approved: boolean,
		resolutionMessage?: string,
	): Promise<HelixUnbanRequest> {
		const broadcasterId = extractUserId(broadcaster);
		const result = await this._client.callApi<HelixResponse<HelixUnbanRequestData>>({
			type: 'helix',
			url: 'moderation/unban_requests',
			method: 'PATCH',
			userId: broadcasterId,
			scopes: ['moderator:manage:unban_requests'],
			canOverrideScopedUserContext: true,
			query: createResolveUnbanRequestQuery(
				broadcasterId,
				this._getUserContextIdWithDefault(broadcasterId),
				unbanRequestId,
				approved,
				resolutionMessage?.slice(0, 500),
			),
		});

		return new HelixUnbanRequest(result.data[0], this._client);
	}

	/**
	 * Warns a user in the specified broadcaster’s chat room, preventing them from chat interaction until the
	 * warning is acknowledged.
	 *
	 * New warnings can be issued to a user when they already have a warning in the channel
	 * (new warning will replace old warning).
	 *
	 * @param broadcaster The ID of the broadcaster in which channel the warning will take effect.
	 * @param user The ID of the user to be warned.
	 * @param reason A custom reason for the warning. Max 500 chars.
	 */
	async warnUser(broadcaster: UserIdResolvable, user: UserIdResolvable, reason: string): Promise<HelixWarning> {
		const broadcasterId = extractUserId(broadcaster);
		const result = await this._client.callApi<HelixResponse<HelixWarningData>>({
			type: 'helix',
			url: 'moderation/warnings',
			method: 'POST',
			userId: broadcasterId,
			scopes: ['moderator:manage:warnings'],
			canOverrideScopedUserContext: true,
			query: this._createModeratorActionQuery(broadcasterId),
			jsonBody: createWarnUserBody(user, reason.slice(0, 500)),
		});

		return new HelixWarning(result.data[0], this._client);
	}

	private _createModeratorActionQuery(broadcasterId: string) {
		return createModeratorActionQuery(broadcasterId, this._getUserContextIdWithDefault(broadcasterId));
	}
}
