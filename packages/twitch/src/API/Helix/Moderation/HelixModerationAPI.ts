import { extractUserId, UserIdResolvable } from '../../../Toolkit/UserTools';
import { TwitchAPICallType } from '../../../TwitchClient';
import BaseAPI from '../../BaseAPI';
import HelixPaginatedRequest from '../HelixPaginatedRequest';
import { createPaginatedResult } from '../HelixPaginatedResult';
import { HelixForwardPagination, makePaginationQuery } from '../HelixPagination';
import { HelixPaginatedResponse } from '../HelixResponse';
import HelixBan, { HelixBanData } from './HelixBan';
import HelixBanEvent, { HelixBanEventData } from './HelixBanEvent';
import HelixModerator, { HelixModeratorData } from './HelixModerator';
import HelixModeratorEvent, { HelixModeratorEventData } from './HelixModeratorEvent';

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
interface HelixModeratorFilter extends HelixForwardPagination {
	/**
	 * A user ID or a list thereof.
	 */
	userId: string | string[];
}

/**
 * The Helix API methods that deal with moderation.
 *
 * Can be accessed using `client.helix.moderation` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = TwitchClient.withCredentials(clientId, accessToken);
 * const game = await client.helix.moderation.getBannedUsers('61369223');
 * ```
 */
export default class HelixModerationAPI extends BaseAPI {
	/**
	 * Retrieves a list of banned users in a given channel.
	 *
	 * @param channel The channel to retrieve the banned users from.
	 * @param filter Additional filters for the result set.
	 */
	async getBannedUsers(channel: UserIdResolvable, filter?: HelixBanFilter) {
		const result = await this._client.callAPI<HelixPaginatedResponse<HelixBanData>>({
			type: TwitchAPICallType.Helix,
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
	getBannedUsersPaginated(channel: UserIdResolvable) {
		return new HelixPaginatedRequest(
			{
				url: 'moderation/banned',
				scope: 'moderation:read',
				query: {
					broadcaster_id: extractUserId(channel)
				}
			},
			this._client,
			(data: HelixBanData) => new HelixBan(data, this._client)
		);
	}

	/**
	 * Checks whether a given user is banned in a given channel.
	 *
	 * @param channel The channel to check for a ban of the given user.
	 * @param user The user to check for a ban in the given channel.
	 */
	async checkUserBan(channel: UserIdResolvable, user: UserIdResolvable) {
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
	async getBanEvents(channel: UserIdResolvable, filter?: HelixBanFilter) {
		const result = await this._client.callAPI<HelixPaginatedResponse<HelixBanEventData>>({
			type: TwitchAPICallType.Helix,
			url: 'moderation/banned/events',
			scope: 'moderation:read',
			query: {
				broadcaster_id: extractUserId(channel),
				user_id: filter?.userId,
				...makePaginationQuery(filter)
			}
		});

		return {
			data: result.data.map(data => new HelixBanEvent(data, this._client)),
			cursor: result.pagination?.cursor
		};
	}

	/**
	 * Creates a paginator for ban events for a given channel.
	 *
	 * @param channel The channel to retrieve the ban events from.
	 */
	getBanEventsPaginated(channel: UserIdResolvable) {
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
	async getModerators(channel: UserIdResolvable, filter?: HelixModeratorFilter) {
		const result = await this._client.callAPI<HelixPaginatedResponse<HelixModeratorData>>({
			type: TwitchAPICallType.Helix,
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
	getModeratorsPaginated(channel: UserIdResolvable) {
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
	async checkUserMod(channel: UserIdResolvable, user: UserIdResolvable) {
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
	async getModeratorEvents(channel: UserIdResolvable, filter?: HelixModeratorFilter) {
		const result = await this._client.callAPI<HelixPaginatedResponse<HelixModeratorEventData>>({
			type: TwitchAPICallType.Helix,
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
	getModeratorEventsPaginated(channel: UserIdResolvable) {
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
