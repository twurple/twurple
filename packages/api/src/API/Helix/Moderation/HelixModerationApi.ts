import { TwitchApiCallType } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixForwardPagination } from '../HelixPagination';
import { makePaginationQuery } from '../HelixPagination';
import type { HelixPaginatedResponse } from '../HelixResponse';
import type { HelixBanData } from './HelixBan';
import { HelixBan } from './HelixBan';
import type { HelixBanEventData } from './HelixBanEvent';
import { HelixBanEvent } from './HelixBanEvent';
import type { HelixModeratorData } from './HelixModerator';
import { HelixModerator } from './HelixModerator';
import type { HelixModeratorEventData } from './HelixModeratorEvent';
import { HelixModeratorEvent } from './HelixModeratorEvent';

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

/**
 * The Helix API methods that deal with moderation.
 *
 * Can be accessed using `client.helix.moderation` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const { data: users } = await api.helix.moderation.getBannedUsers('61369223');
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
			type: TwitchApiCallType.Helix,
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
			(data: HelixBanData) => new HelixBan(data, this._client),
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
	 * Retrieves a list of ban events for a given channel.
	 *
	 * @param channel The channel to retrieve the ban events from.
	 * @param filter Additional filters for the result set.
	 */
	async getBanEvents(
		channel: UserIdResolvable,
		filter?: HelixBanFilter
	): Promise<HelixPaginatedResult<HelixBanEvent>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixBanEventData>>({
			type: TwitchApiCallType.Helix,
			url: 'moderation/banned/events',
			scope: 'moderation:read',
			query: {
				broadcaster_id: extractUserId(channel),
				user_id: filter?.userId,
				...makePaginationQuery(filter)
			}
		});

		return createPaginatedResult(result, HelixBanEvent, this._client);
	}

	/**
	 * Creates a paginator for ban events for a given channel.
	 *
	 * @param channel The channel to retrieve the ban events from.
	 */
	getBanEventsPaginated(channel: UserIdResolvable): HelixPaginatedRequest<HelixBanEventData, HelixBanEvent> {
		return new HelixPaginatedRequest(
			{
				url: 'moderation/banned/events',
				scope: 'moderation:read',
				query: {
					broadcaster_id: extractUserId(channel)
				}
			},
			this._client,
			(data: HelixBanEventData) => new HelixBanEvent(data, this._client)
		);
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
			type: TwitchApiCallType.Helix,
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
			(data: HelixModeratorData) => new HelixModerator(data, this._client)
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
	 * Retrieves a list of moderator events for a given channel.
	 *
	 * @param channel The channel to retrieve the moderator events from.
	 * @param filter Additional filters for the result set.
	 */
	async getModeratorEvents(
		channel: UserIdResolvable,
		filter?: HelixModeratorFilter
	): Promise<HelixPaginatedResult<HelixModeratorEvent>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixModeratorEventData>>({
			type: TwitchApiCallType.Helix,
			url: 'moderation/moderators/events',
			scope: 'moderation:read',
			query: {
				broadcaster_id: extractUserId(channel),
				user_id: filter?.userId,
				...makePaginationQuery(filter)
			}
		});

		return createPaginatedResult(result, HelixModeratorEvent, this._client);
	}

	/**
	 * Creates a paginator for moderator events for a given channel.
	 *
	 * @param channel The channel to retrieve the moderator events from.
	 */
	getModeratorEventsPaginated(
		channel: UserIdResolvable
	): HelixPaginatedRequest<HelixModeratorEventData, HelixModeratorEvent> {
		return new HelixPaginatedRequest(
			{
				url: 'moderation/moderators/events',
				scope: 'moderation:read',
				query: {
					broadcaster_id: extractUserId(channel)
				}
			},
			this._client,
			(data: HelixModeratorEventData) => new HelixModeratorEvent(data, this._client)
		);
	}
}
