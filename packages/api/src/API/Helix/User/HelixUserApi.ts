import type { UserIdResolvable, UserNameResolvable } from '@twurple/common';
import { extractUserId, extractUserName, HellFreezesOverError, rtfm } from '@twurple/common';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import { HelixPaginatedRequestWithTotal } from '../HelixPaginatedRequestWithTotal';
import type { HelixPaginatedResult, HelixPaginatedResultWithTotal } from '../HelixPaginatedResult';
import { createPaginatedResult, createPaginatedResultWithTotal } from '../HelixPaginatedResult';
import type { HelixForwardPagination } from '../HelixPagination';
import { makePaginationQuery } from '../HelixPagination';
import type { HelixPaginatedResponse, HelixPaginatedResponseWithTotal, HelixResponse } from '../HelixResponse';
import type { HelixInstalledExtensionListData } from './Extensions/HelixInstalledExtensionList';
import { HelixInstalledExtensionList } from './Extensions/HelixInstalledExtensionList';
import type { HelixUserExtensionData } from './Extensions/HelixUserExtension';
import { HelixUserExtension } from './Extensions/HelixUserExtension';
import type { HelixUserExtensionUpdatePayload } from './Extensions/HelixUserExtensionUpdatePayload';
import type { HelixFollowData } from './HelixFollow';
import { HelixFollow } from './HelixFollow';
import type { HelixPrivilegedUserData } from './HelixPrivilegedUser';
import { HelixPrivilegedUser } from './HelixPrivilegedUser';
import type { HelixUserData } from './HelixUser';
import { HelixUser } from './HelixUser';
import type { HelixUserBlockData } from './HelixUserBlock';
import { HelixUserBlock } from './HelixUserBlock';

/** @private */
export type UserLookupType = 'id' | 'login';

/**
 * User data to update using {@HelixUserApi#updateUser}.
 */
export interface HelixUserUpdate {
	description?: string;
}

/**
 * Additional info for a block to be created.
 */
export interface HelixUserBlockAdditionalInfo {
	/**
	 * The source context for blocking the user.
	 */
	sourceContext?: 'chat' | 'whisper';

	/**
	 * The reason for blocking the user.
	 */
	reason?: 'spam' | 'harassment' | 'other';
}

/**
 * Filters for the follower request.
 */
export interface HelixFollowFilter {
	/**
	 * The following user.
	 */
	user?: UserIdResolvable;

	/**
	 * The followed user.
	 */
	followedUser?: UserIdResolvable;
}

/**
 * @inheritDoc
 */
export interface HelixPaginatedFollowFilter extends HelixFollowFilter, HelixForwardPagination {}

/**
 * The Helix API methods that deal with users.
 *
 * Can be accessed using `client.helix.users` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const user = await api.helix.users.getUserById('125328655');
 * ```
 */
@rtfm('api', 'HelixUserApi')
export class HelixUserApi extends BaseApi {
	/**
	 * Retrieves the user data for the given list of user IDs.
	 *
	 * @param userIds The user IDs you want to look up.
	 */
	async getUsersByIds(userIds: UserIdResolvable[]): Promise<HelixUser[]> {
		return await this._getUsers('id', userIds.map(extractUserId));
	}

	/**
	 * Retrieves the user data for the given list of user names.
	 *
	 * @param userNames The user names you want to look up.
	 */
	async getUsersByNames(userNames: UserNameResolvable[]): Promise<HelixUser[]> {
		return await this._getUsers('login', userNames.map(extractUserName));
	}

	/**
	 * Retrieves the user data for the given user ID.
	 *
	 * @param userId The user ID you want to look up.
	 */
	async getUserById(userId: UserIdResolvable): Promise<HelixUser | null> {
		const users = await this._getUsers('id', [extractUserId(userId)]);
		return users.length ? users[0] : null;
	}

	/**
	 * Retrieves the user data for the given user name.
	 *
	 * @param userName The user name you want to look up.
	 */
	async getUserByName(userName: UserNameResolvable): Promise<HelixUser | null> {
		const users = await this._getUsers('login', [extractUserName(userName)]);
		return users.length ? users[0] : null;
	}

	/**
	 * Retrieves the user data of the currently authenticated user.
	 *
	 * @param withEmail Whether you need the user's email address.
	 */
	async getMe(withEmail: boolean = false): Promise<HelixPrivilegedUser> {
		const result = await this._client.callApi<HelixResponse<HelixPrivilegedUserData>>({
			type: 'helix',
			url: 'users',
			scope: withEmail ? 'user:read:email' : ''
		});

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!result.data?.length) {
			throw new HellFreezesOverError('Could not get authenticated user');
		}

		return new HelixPrivilegedUser(result.data[0], this._client);
	}

	/**
	 * Updates the currently authenticated user's data.
	 *
	 * @param data The data to update.
	 */
	async updateUser(data: HelixUserUpdate): Promise<HelixPrivilegedUser> {
		const result = await this._client.callApi<HelixResponse<HelixPrivilegedUserData>>({
			type: 'helix',
			url: 'users',
			method: 'PUT',
			scope: 'user:edit',
			query: {
				description: data.description
			}
		});

		return new HelixPrivilegedUser(result.data[0], this._client);
	}

	/**
	 * Retrieves a list of follow relations.
	 *
	 * @param filter
	 *
	 * @expandParams
	 */
	async getFollows(filter: HelixPaginatedFollowFilter): Promise<HelixPaginatedResultWithTotal<HelixFollow>> {
		const result = await this._client.callApi<HelixPaginatedResponseWithTotal<HelixFollowData>>({
			url: 'users/follows',
			type: 'helix',
			query: {
				...HelixUserApi._makeFollowsQuery(filter),
				...makePaginationQuery(filter)
			}
		});

		return createPaginatedResultWithTotal(result, HelixFollow, this._client);
	}

	/**
	 * Creates a paginator for follow relations.
	 *
	 * @param filter
	 *
	 * @expandParams
	 */
	getFollowsPaginated(filter: HelixFollowFilter): HelixPaginatedRequestWithTotal<HelixFollowData, HelixFollow> {
		const query = HelixUserApi._makeFollowsQuery(filter);

		return new HelixPaginatedRequestWithTotal(
			{
				url: 'users/follows',
				query
			},
			this._client,
			data => new HelixFollow(data, this._client)
		);
	}

	/**
	 * Retrieves the follow relation bewteen a given user and a given broadcaster.
	 *
	 * @param user The user to retrieve the follow relation for.
	 * @param broadcaster The broadcaster to retrieve the follow relation for.
	 */
	async getFollowFromUserToBroadcaster(
		user: UserIdResolvable,
		broadcaster: UserIdResolvable
	): Promise<HelixFollow | null> {
		const { data: result } = await this.getFollows({ user, followedUser: broadcaster });

		return result.length ? result[0] : null;
	}

	/**
	 * Checks whether the given user follows the given broadcaster.
	 *
	 * @param user The user to check the follow for.
	 * @param broadcaster The broadcaster to check the follow for.
	 */
	async userFollowsBroadcaster(user: UserIdResolvable, broadcaster: UserIdResolvable): Promise<boolean> {
		return (await this.getFollowFromUserToBroadcaster(user, broadcaster)) !== null;
	}

	/**
	 * Creates a new follow from a user to another user.
	 *
	 * @param fromUser The user to create the follow for.
	 * @param toUser The user to follow.
	 * @param allowNotifications Whether email or push notifications are allowed to be created.
	 *
	 * The user `fromUser` still needs to have this enabled in their settings as well.
	 */
	async createFollow(
		fromUser: UserIdResolvable,
		toUser: UserIdResolvable,
		allowNotifications?: boolean
	): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'users/follows',
			method: 'POST',
			scope: 'user:edit:follows',
			jsonBody: {
				from_id: extractUserId(fromUser),
				to_id: extractUserId(toUser),
				allow_notifications: allowNotifications
			}
		});
	}

	/**
	 * Removes a follow from a user to another user.
	 *
	 * @param fromUser The user to remove the follow for.
	 * @param toUser The user to unfollow.
	 */
	async deleteFollow(fromUser: UserIdResolvable, toUser: UserIdResolvable): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'users/follows',
			method: 'DELETE',
			scope: 'user:edit:follows',
			jsonBody: {
				from_id: extractUserId(fromUser),
				to_id: extractUserId(toUser)
			}
		});
	}

	/**
	 * Retrieves a list of users blocked by the given user.
	 *
	 * @param user The user to retrieve blocks for.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getBlocks(
		user: UserIdResolvable,
		pagination?: HelixForwardPagination
	): Promise<HelixPaginatedResult<HelixUserBlock>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixUserBlockData>>({
			type: 'helix',
			url: 'users/blocks',
			scope: 'user:read:blocked_users',
			query: {
				broadcaster_id: extractUserId(user),
				...makePaginationQuery(pagination)
			}
		});

		return createPaginatedResult(result, HelixUserBlock, this._client);
	}

	/**
	 * Creates a paginator for users blocked by the given user.
	 *
	 * @param user The user to retrieve blocks for.
	 */
	getBlocksPaginated(user: UserIdResolvable): HelixPaginatedRequest<HelixUserBlockData, HelixUserBlock> {
		return new HelixPaginatedRequest(
			{
				url: 'users/blocks',
				scope: 'user:read:blocked_users',
				query: {
					broadcaster_id: extractUserId(user)
				}
			},
			this._client,
			data => new HelixUserBlock(data, this._client)
		);
	}

	/**
	 * Blocks the given user.
	 *
	 * @param target The user to block.
	 * @param additionalInfo Additional info to give context to the block.
	 *
	 * @expandParams
	 */
	async createBlock(target: UserIdResolvable, additionalInfo: HelixUserBlockAdditionalInfo = {}): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'users/blocks',
			method: 'PUT',
			scope: 'user:manage:blocked_users',
			query: {
				target_user_id: extractUserId(target),
				source_context: additionalInfo.sourceContext,
				reason: additionalInfo.reason
			}
		});
	}

	/**
	 * Unblocks the given user.
	 *
	 * @param target The user to unblock.
	 */
	async deleteBlock(target: UserIdResolvable): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'users/blocks',
			method: 'DELETE',
			scope: 'user:manage:blocked_users',
			query: {
				target_user_id: extractUserId(target)
			}
		});
	}

	/**
	 * Retrieves a list of all extensions for the authenticated user.
	 */
	async getMyExtensions(): Promise<HelixUserExtension[]> {
		const result = await this._client.callApi<HelixResponse<HelixUserExtensionData>>({
			type: 'helix',
			url: 'users/extensions/list'
		});

		return result.data.map(data => new HelixUserExtension(data));
	}

	/**
	 * Retrieves a list of all installed extensions for the given user.
	 *
	 * @param user The user to get the installed extensions for.
	 *
	 * If not given, get the installed extensions for the authenticated user.
	 */
	async getActiveExtensions(user?: UserIdResolvable): Promise<HelixInstalledExtensionList> {
		const userId = user ? extractUserId(user) : undefined;
		const result = await this._client.callApi<{ data: HelixInstalledExtensionListData }>({
			type: 'helix',
			url: 'users/extensions',
			query: {
				user_id: userId
			}
		});

		return new HelixInstalledExtensionList(result.data);
	}

	/**
	 * Updates the installed extensions for the authenticated user.
	 *
	 * @param data The extension installation payload.
	 *
	 * The format is shown on the [Twitch documentation](https://dev.twitch.tv/docs/api/reference#update-user-extensions).
	 * Don't use the "data" wrapper though.
	 */
	async updateMyActiveExtensions(data: HelixUserExtensionUpdatePayload): Promise<HelixInstalledExtensionList> {
		const result = await this._client.callApi<{ data: HelixInstalledExtensionListData }>({
			type: 'helix',
			url: 'users/extensions',
			jsonBody: { data }
		});

		return new HelixInstalledExtensionList(result.data);
	}

	private static _makeFollowsQuery(filter: HelixFollowFilter) {
		const query: Record<string, string | undefined> = {};
		let hasUserIdParam = false;
		if (filter.user) {
			query.from_id = extractUserId(filter.user);
			hasUserIdParam = true;
		}
		if (filter.followedUser) {
			query.to_id = extractUserId(filter.followedUser);
			hasUserIdParam = true;
		}

		if (!hasUserIdParam) {
			throw new TypeError('At least one of user and followedUser have to be set');
		}

		return query;
	}

	private async _getUsers(lookupType: UserLookupType, param: string[]) {
		if (param.length === 0) {
			return [];
		}
		const query: Record<string, string | string[] | undefined> = { [lookupType]: param };
		const result = await this._client.callApi<HelixPaginatedResponse<HelixUserData>>({
			type: 'helix',
			url: 'users',
			query
		});

		return result.data.map(userData => new HelixUser(userData, this._client));
	}
}
