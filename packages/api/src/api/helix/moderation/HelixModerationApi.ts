import type { HelixPaginatedResponse, HelixResponse } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixForwardPagination } from '../HelixPagination';
import { makePaginationQuery } from '../HelixPagination';
import type { HelixAutoModSettingsData } from './HelixAutoModSettings';
import { HelixAutoModSettings } from './HelixAutoModSettings';
import type { HelixAutoModStatusData } from './HelixAutoModStatus';
import { HelixAutoModStatus } from './HelixAutoModStatus';
import type { HelixBanData } from './HelixBan';
import { HelixBan } from './HelixBan';
import type { HelixBanUserData } from './HelixBanUser';
import { HelixBanUser } from './HelixBanUser';
import type { HelixBlockedTermData } from './HelixBlockedTerm';
import { HelixBlockedTerm } from './HelixBlockedTerm';
import type { HelixModeratorData } from './HelixModerator';
import { HelixModerator } from './HelixModerator';

/**
 * Filters for the banned users request.
 */
export interface HelixBanFilter extends HelixForwardPagination {
	/**
	 * A user ID or a list thereof.
	 */
	userId: string | string[];
}

/**
 * Filters for the moderators request.
 */
export interface HelixModeratorFilter extends HelixForwardPagination {
	/**
	 * A user ID or a list thereof.
	 */
	userId: string | string[];
}

export interface HelixCheckAutoModStatusData {
	/**
	 * The developer-generated ID for mapping messages to their status results.
	 */
	messageId: string;

	/**
	 * The text of the message the AutoMod status needs to be checked for.
	 */
	messageText: string;

	/**
	 * The ID of the sender of the message the AutoMod status needs to be checked for.
	 *
	 * @deprecated This is no longer used by Twitch.
	 */
	userId?: string;
}

export type HelixAutoModSettingsUpdate = Exclude<HelixAutoModSettings, 'broadcasterId' | 'moderatorId'>;

/**
 * Information about a user to be banned/timed out from a channel.
 */
export interface HelixBanUserRequest {
	/**
	 * The duration (in seconds) that the user should be timed out. If this value is null, the user will be banned.
	 */
	duration?: number;

	/**
	 * The reason why the user is being timed out/banned.
	 */
	reason: string;

	/**
	 * The ID of the user who is to be banned/timed out.
	 */
	userId: string;
}

/**
 * The Helix API methods that deal with moderation.
 *
 * Can be accessed using `client.moderation` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const { data: users } = await api.moderation.getBannedUsers('61369223');
 * ```
 */
@rtfm('api', 'HelixModerationApi')
export class HelixModerationApi extends BaseApi {
	/**
	 * Retrieves a list of banned users in a given channel.
	 *
	 * @param channel The channel to retrieve the banned users from.
	 * @param filter Additional filters for the result set.
	 */
	async getBannedUsers(channel: UserIdResolvable, filter?: HelixBanFilter): Promise<HelixPaginatedResult<HelixBan>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixBanData>>({
			type: 'helix',
			url: 'moderation/banned',
			scope: 'moderation:read',
			query: {
				broadcaster_id: extractUserId(channel),
				user_id: filter?.userId,
				...makePaginationQuery(filter)
			}
		});

		return createPaginatedResult(result, HelixBan, this._client);
	}

	/**
	 * Creates a paginator for banned users in a given channel.
	 *
	 * @param channel The channel to retrieve the banned users from.
	 */
	getBannedUsersPaginated(channel: UserIdResolvable): HelixPaginatedRequest<HelixBanData, HelixBan> {
		return new HelixPaginatedRequest(
			{
				url: 'moderation/banned',
				scope: 'moderation:read',
				query: {
					broadcaster_id: extractUserId(channel)
				}
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
	 * Retrieves a list of moderators in a given channel.
	 *
	 * @param channel The channel to retrieve moderators from.
	 * @param filter Additional filters for the result set.
	 */
	async getModerators(
		channel: UserIdResolvable,
		filter?: HelixModeratorFilter
	): Promise<HelixPaginatedResult<HelixModerator>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixModeratorData>>({
			type: 'helix',
			url: 'moderation/moderators',
			scope: 'moderation:read',
			query: {
				broadcaster_id: extractUserId(channel),
				user_id: filter?.userId,
				...makePaginationQuery(filter)
			}
		});

		return createPaginatedResult(result, HelixModerator, this._client);
	}

	/**
	 * Creates a paginator for moderators in a given channel.
	 *
	 * @param channel The channel to retrieve moderators from.
	 */
	getModeratorsPaginated(channel: UserIdResolvable): HelixPaginatedRequest<HelixModeratorData, HelixModerator> {
		return new HelixPaginatedRequest(
			{
				url: 'moderation/moderators',
				scope: 'moderation:read',
				query: {
					broadcaster_id: extractUserId(channel)
				}
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
			scope: 'moderation:read',
			query: {
				broadcaster_id: extractUserId(channel)
			},
			jsonBody: {
				data: data
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
			scope: 'moderator:manage:automod',
			jsonBody: {
				user_id: extractUserId(user),
				msg_id: msgId,
				action: allow ? 'ALLOW' : 'DENY'
			}
		});
	}

	/**
	 * Retrieves the AutoMod settings for a broadcaster.
	 *
	 * @param broadcasterId The ID of the broadcaster for which the AutoMod settings are retrieved.
	 * @param moderatorId The ID of a user that has permission to moderate the broadcaster's chat room.
	 * This must match the user ID associated with the user OAuth token.
	 */
	async getAutoModSettings(
		broadcasterId: UserIdResolvable,
		moderatorId: UserIdResolvable
	): Promise<HelixAutoModSettings[]> {
		const result = await this._client.callApi<HelixResponse<HelixAutoModSettingsData>>({
			type: 'helix',
			url: 'moderation/automod/settings',
			scope: 'moderator:read:automod_settings',
			query: {
				broadcaster_id: extractUserId(broadcasterId),
				moderator_id: extractUserId(moderatorId)
			}
		});

		return result.data.map(data => new HelixAutoModSettings(data));
	}

	/**
	 * Updates the AutoMod settings for a broadcaster.
	 *
	 * @param broadcasterId The ID of the broadcaster for which the AutoMod settings are updated.
	 * @param moderatorId The ID of a user that has permission to moderate the broadcaster's chat room.
	 * This must match the user ID associated with the user OAuth token.
	 * @param data The updated AutoMod settings that replace the current AutoMod settings.
	 */
	async updateAutoModSettings(
		broadcasterId: UserIdResolvable,
		moderatorId: UserIdResolvable,
		data: HelixAutoModSettingsUpdate
	): Promise<HelixAutoModSettings[]> {
		const result = await this._client.callApi<HelixResponse<HelixAutoModSettingsData>>({
			type: 'helix',
			url: 'moderation/automod/settings',
			method: 'PUT',
			scope: 'moderator:manage:automod_settings',
			query: {
				broadcaster_id: extractUserId(broadcasterId),
				moderator_id: extractUserId(moderatorId)
			},
			jsonBody: {
				overall_level: data.overallLevel,
				aggression: data.aggression,
				bullying: data.bullying,
				disability: data.disability,
				misogyny: data.misogyny,
				race_ethnicity_or_religion: data.raceEthnicityOrReligion,
				sex_based_terms: data.sexBasedTerms,
				sexuality_sex_or_gender: data.sexualitySexOrGender,
				swearing: data.swearing
			}
		});

		return result.data.map(settingsData => new HelixAutoModSettings(settingsData));
	}

	/**
	 * Bans or times out a user in a channel
	 *
	 * @param broadcasterId The ID of the broadcaster in whose channel the user will be banned/timed out.
	 * @param moderatorId The ID of a user that has permission to ban/timeout users in the broadcaster's chat room.
	 * This must match the user ID associated with the user OAuth token.
	 * @param data
	 *
	 * @expandParams
	 *
	 * @returns The result data from the ban/timeout request.
	 */
	async banUser(
		broadcasterId: UserIdResolvable,
		moderatorId: UserIdResolvable,
		data: HelixBanUserRequest
	): Promise<HelixBanUser[]> {
		const result = await this._client.callApi<HelixResponse<HelixBanUserData>>({
			type: 'helix',
			url: 'moderation/bans',
			method: 'POST',
			scope: 'moderator:manage:banned_users',
			query: {
				broadcaster_id: extractUserId(broadcasterId),
				moderator_id: extractUserId(moderatorId)
			},
			jsonBody: {
				data: {
					duration: data.duration,
					reason: data.reason,
					user_id: data.userId
				}
			}
		});

		return result.data.map(banData => new HelixBanUser(banData));
	}

	/**
	 * Unbans/removes the timeout for a user in a channel.
	 *
	 * @param broadcasterId The ID of the broadcaster in whose channel the user will be unbanned/removed from timeout.
	 * @param moderatorId The ID of a user that has permission to unban/remove timeout users in the broadcaster's chat room.
	 * This must match the user ID associated with the user OAuth token.
	 * @param userId The ID of the user who will be unbanned/removed from timeout.
	 */
	async unbanUser(
		broadcasterId: UserIdResolvable,
		moderatorId: UserIdResolvable,
		userId: UserIdResolvable
	): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'moderation/bans',
			method: 'DELETE',
			scope: 'moderator:manage:banned_users',
			query: {
				broadcaster_id: extractUserId(broadcasterId),
				moderator_id: extractUserId(moderatorId),
				user_id: extractUserId(userId)
			}
		});
	}

	/**
	 * Gets the broadcaster’s list of non-private, blocked words or phrases.
	 *
	 * @param broadcasterId The ID of the broadcaster for whose channel blocked terms will be retrieved.
	 * @param moderatorId The ID of a user that has permission to retrieve blocked terms for the broadcaster's channel.
	 * This must match the user ID associated with the user OAuth token.
	 * @param pagination
	 *
	 * @expandParams
	 *
	 * @returns A paginated list of blocked term data in the broadcaster's channel.
	 */
	async getBlockedTerms(
		broadcasterId: UserIdResolvable,
		moderatorId: UserIdResolvable,
		pagination?: HelixForwardPagination
	): Promise<HelixPaginatedResult<HelixBlockedTerm>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixBlockedTermData>>({
			type: 'helix',
			url: 'moderation/blocked_terms',
			scope: 'moderator:read:blocked_terms',
			query: {
				broadcaster_id: extractUserId(broadcasterId),
				moderator_id: extractUserId(moderatorId),
				...makePaginationQuery(pagination)
			}
		});

		return createPaginatedResult(result, HelixBlockedTerm, this._client);
	}

	/**
	 * Adds a blocked term to the broadcaster's channel.
	 *
	 * @param broadcasterId The ID of the broadcaster in whose channel the term will be blocked.
	 * @param moderatorId The ID of a user that has permission to block terms in the broadcaster's channel.
	 * This must match the user ID associated with the user OAuth token.
	 * @param text The word or phrase to block from being used in the broadcaster's channel.
	 *
	 * @returns Information about the term that has been blocked.
	 */
	async addBlockedTerm(
		broadcasterId: UserIdResolvable,
		moderatorId: UserIdResolvable,
		text: string
	): Promise<HelixBlockedTerm[]> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixBlockedTermData>>({
			type: 'helix',
			url: 'moderation/blocked_terms',
			method: 'POST',
			scope: 'moderator:manage:blocked_terms',
			query: {
				broadcaster_id: extractUserId(broadcasterId),
				moderator_id: extractUserId(moderatorId)
			},
			jsonBody: {
				text
			}
		});

		return result.data.map(blockedTermData => new HelixBlockedTerm(blockedTermData));
	}

	/**
	 * Removes a blocked term from the broadcaster's channel.
	 *
	 * @param broadcasterId The ID of the broadcaster in whose channel the term will be unblocked.
	 * @param moderatorId The ID of a user that has permission to unblock terms in the broadcaster's channel.
	 * This must match the user ID associated with the user OAuth token.
	 * @param id The ID of the term that should be unblocked.
	 */
	async removeBlockedTerm(broadcasterId: UserIdResolvable, moderatorId: UserIdResolvable, id: string): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'moderation/blocked_terms',
			method: 'DELETE',
			scope: 'moderator:manage:blocked_terms',
			query: {
				broadcaster_id: extractUserId(broadcasterId),
				moderator_id: extractUserId(moderatorId),
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
			scope: 'moderator:manage:chat_messages',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				moderator_id: extractUserId(moderator),
				message_id: messageId
			}
		});
	}

	/**
	 * Adds a moderator to the broadcaster’s chat room.
	 *
	 * @param broadcaster The ID of the broadcaster that owns the chat room. This ID must match the user ID in the access token.
	 * @param user The ID of the user to add as a moderator in the broadcaster’s chat room.
	 */
	async addChannelModerator(broadcaster: UserIdResolvable, user: UserIdResolvable): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'moderation/moderators',
			method: 'POST',
			scope: 'channel:manage:moderators',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				user_id: extractUserId(user)
			}
		});
	}

	/**
	 * Removes a moderator from the broadcaster’s chat room.
	 *
	 * @param broadcaster The ID of the broadcaster that owns the chat room. This ID must match the user ID in the access token.
	 * @param user The ID of the user to remove as a moderator from the broadcaster’s chat room.
	 */
	async removeChannelModerator(broadcaster: UserIdResolvable, user: UserIdResolvable): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'moderation/moderators',
			method: 'DELETE',
			scope: 'channel:manage:moderators',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				user_id: extractUserId(user)
			}
		});
	}
}
