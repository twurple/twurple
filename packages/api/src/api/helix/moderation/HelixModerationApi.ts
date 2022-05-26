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
	 */
	userId: string;
}

export type HelixAutoModSettingsUpdate = Exclude<HelixAutoModSettings, 'broadcasterId' | 'moderatorId'>;

export interface HelixBanUserRequest {
	/**
	 * The duration (in seconds) that the user should be timed out. If this value is null, the user will be banned.
	 */
	duration: number | null;

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
	 * @param data The data about the ban/timeout, including the user's ID, the reason, and the duration (for timeouts only).
	 * Don't use the "data" wrapper.
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
}
