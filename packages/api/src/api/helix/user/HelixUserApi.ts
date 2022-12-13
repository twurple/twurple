import { mapOptional } from '@d-fischer/shared-utils';
import type { HelixPaginatedResponse, HelixPaginatedResponseWithTotal, HelixResponse } from '@twurple/api-call';
import { createBroadcasterQuery } from '@twurple/api-call';
import type { UserIdResolvable, UserNameResolvable } from '@twurple/common';
import { extractUserId, extractUserName, HellFreezesOverError, rtfm } from '@twurple/common';
import { createSingleKeyQuery } from '../../../interfaces/helix/generic.external';
import {
	createUserBlockCreateQuery,
	createUserBlockDeleteQuery,
	type HelixFollowData,
	type HelixPrivilegedUserData,
	type HelixUserBlockData,
	type HelixUserData,
	type UserLookupType
} from '../../../interfaces/helix/user.external';
import {
	type HelixFollowFilter,
	type HelixPaginatedFollowFilter,
	type HelixUserBlockAdditionalInfo,
	type HelixUserUpdate
} from '../../../interfaces/helix/user.input';
import {
	type HelixInstalledExtensionListData,
	type HelixUserExtensionData
} from '../../../interfaces/helix/userExtension.external';
import { type HelixUserExtensionUpdatePayload } from '../../../interfaces/helix/userExtension.input';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import { HelixPaginatedRequestWithTotal } from '../HelixPaginatedRequestWithTotal';
import type { HelixPaginatedResult, HelixPaginatedResultWithTotal } from '../HelixPaginatedResult';
import { createPaginatedResult, createPaginatedResultWithTotal } from '../HelixPaginatedResult';
import type { HelixForwardPagination } from '../HelixPagination';
import { createPaginationQuery } from '../HelixPagination';
import { HelixInstalledExtensionList } from './Extensions/HelixInstalledExtensionList';
import { HelixUserExtension } from './Extensions/HelixUserExtension';
import { HelixFollow } from './HelixFollow';
import { HelixPrivilegedUser } from './HelixPrivilegedUser';
import { HelixUser } from './HelixUser';
import { HelixUserBlock } from './HelixUserBlock';

/**
 * The Helix API methods that deal with users.
 *
 * Can be accessed using `client.users` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const user = await api.users.getUserById('125328655');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Users
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
	 * @param user The user ID you want to look up.
	 */
	async getUserById(user: UserIdResolvable): Promise<HelixUser | null> {
		const users = await this._getUsers('id', [extractUserId(user)]);
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
				...createPaginationQuery(filter)
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
				...createBroadcasterQuery(user),
				...createPaginationQuery(pagination)
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
				query: createBroadcasterQuery(user)
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
			query: createUserBlockCreateQuery(target, additionalInfo)
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
			query: createUserBlockDeleteQuery(target)
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
		const result = await this._client.callApi<{ data: HelixInstalledExtensionListData }>({
			type: 'helix',
			url: 'users/extensions',
			query: createSingleKeyQuery('user_id', mapOptional(user, extractUserId))
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
			method: 'PUT',
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
