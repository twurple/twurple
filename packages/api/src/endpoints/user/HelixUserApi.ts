import { Enumerable, mapNullable } from '@d-fischer/shared-utils';
import { createBroadcasterQuery, type HelixPaginatedResponse, type HelixResponse } from '@twurple/api-call';
import {
	extractUserId,
	extractUserName,
	HellFreezesOverError,
	rtfm,
	type UserIdResolvable,
	type UserNameResolvable,
} from '@twurple/common';
import { createSingleKeyQuery } from '../../interfaces/endpoints/generic.external.js';
import {
	createUserBlockCreateQuery,
	createUserBlockDeleteQuery,
	type HelixPrivilegedUserData,
	type HelixUserBlockData,
	type HelixUserData,
	type UserLookupType,
} from '../../interfaces/endpoints/user.external.js';
import { type HelixUserBlockAdditionalInfo, type HelixUserUpdate } from '../../interfaces/endpoints/user.input.js';
import {
	type HelixInstalledExtensionListData,
	type HelixUserExtensionData,
} from '../../interfaces/endpoints/userExtension.external.js';
import { type HelixUserExtensionUpdatePayload } from '../../interfaces/endpoints/userExtension.input.js';
import { HelixRequestBatcher } from '../../utils/HelixRequestBatcher.js';
import { HelixPaginatedRequest } from '../../utils/pagination/HelixPaginatedRequest.js';
import { createPaginatedResult, type HelixPaginatedResult } from '../../utils/pagination/HelixPaginatedResult.js';
import { createPaginationQuery, type HelixForwardPagination } from '../../utils/pagination/HelixPagination.js';
import { BaseApi } from '../BaseApi.js';
import { HelixInstalledExtensionList } from './extensions/HelixInstalledExtensionList.js';
import { HelixUserExtension } from './extensions/HelixUserExtension.js';
import { HelixPrivilegedUser } from './HelixPrivilegedUser.js';
import { HelixUser } from './HelixUser.js';
import { HelixUserBlock } from './HelixUserBlock.js';

/**
 * The Helix API methods that deal with users.
 *
 * Can be accessed using `client.users` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient({ authProvider });
 * const user = await api.users.getUserById('125328655');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Users
 */
@rtfm('api', 'HelixUserApi')
export class HelixUserApi extends BaseApi {
	/** @internal */
	@Enumerable(false) private readonly _getUserByIdBatcher = new HelixRequestBatcher(
		{
			url: 'users',
		},
		'id',
		'id',
		this._client,
		(data: HelixUserData) => new HelixUser(data, this._client),
	);

	/** @internal */
	@Enumerable(false) private readonly _getUserByNameBatcher = new HelixRequestBatcher(
		{
			url: 'users',
		},
		'login',
		'login',
		this._client,
		(data: HelixUserData) => new HelixUser(data, this._client),
	);

	/**
	 * Gets the user data for the given list of user IDs.
	 *
	 * @param userIds The user IDs you want to look up.
	 */
	async getUsersByIds(userIds: UserIdResolvable[]): Promise<HelixUser[]> {
		return await this._getUsers('id', userIds.map(extractUserId));
	}

	/**
	 * Gets the user data for the given list of usernames.
	 *
	 * @param userNames The usernames you want to look up.
	 */
	async getUsersByNames(userNames: UserNameResolvable[]): Promise<HelixUser[]> {
		return await this._getUsers('login', userNames.map(extractUserName));
	}

	/**
	 * Gets the user data for the given user ID.
	 *
	 * @param user The user ID you want to look up.
	 */
	async getUserById(user: UserIdResolvable): Promise<HelixUser | null> {
		const userId = extractUserId(user);
		const result = await this._client.callApi<HelixPaginatedResponse<HelixUserData>>({
			type: 'helix',
			url: 'users',
			userId,
			query: {
				id: userId,
			},
		});

		return mapNullable(result.data[0], data => new HelixUser(data, this._client));
	}

	/**
	 * Gets the user data for the given user ID, batching multiple calls into fewer requests as the API allows.
	 *
	 * @param user The user ID you want to look up.
	 */
	async getUserByIdBatched(user: UserIdResolvable): Promise<HelixUser | null> {
		return await this._getUserByIdBatcher.request(extractUserId(user));
	}

	/**
	 * Gets the user data for the given username.
	 *
	 * @param userName The username you want to look up.
	 */
	async getUserByName(userName: UserNameResolvable): Promise<HelixUser | null> {
		const users = await this._getUsers('login', [extractUserName(userName)]);
		return users.length ? users[0] : null;
	}

	/**
	 * Gets the user data for the given username, batching multiple calls into fewer requests as the API allows.
	 *
	 * @param user The username you want to look up.
	 */
	async getUserByNameBatched(user: UserNameResolvable): Promise<HelixUser | null> {
		return await this._getUserByNameBatcher.request(extractUserName(user));
	}

	/**
	 * Gets the user data of the given authenticated user.
	 *
	 * @param user The user to get data for.
	 * @param withEmail Whether you need the user's email address.
	 */
	async getAuthenticatedUser(user: UserIdResolvable, withEmail: boolean = false): Promise<HelixPrivilegedUser> {
		const result = await this._client.callApi<HelixResponse<HelixPrivilegedUserData>>({
			type: 'helix',
			url: 'users',
			forceType: 'user',
			userId: extractUserId(user),
			scopes: withEmail ? ['user:read:email'] : undefined,
		});

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!result.data?.length) {
			throw new HellFreezesOverError('Could not get authenticated user');
		}

		return new HelixPrivilegedUser(result.data[0], this._client);
	}

	/**
	 * Updates the given authenticated user's data.
	 *
	 * @param user The user to update.
	 * @param data The data to update.
	 */
	async updateAuthenticatedUser(user: UserIdResolvable, data: HelixUserUpdate): Promise<HelixPrivilegedUser> {
		const result = await this._client.callApi<HelixResponse<HelixPrivilegedUserData>>({
			type: 'helix',
			url: 'users',
			method: 'PUT',
			userId: extractUserId(user),
			scopes: ['user:edit'],
			query: {
				description: data.description,
			},
		});

		return new HelixPrivilegedUser(result.data[0], this._client);
	}

	/**
	 * Gets a list of users blocked by the given user.
	 *
	 * @param user The user to get blocks for.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getBlocks(
		user: UserIdResolvable,
		pagination?: HelixForwardPagination,
	): Promise<HelixPaginatedResult<HelixUserBlock>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixUserBlockData>>({
			type: 'helix',
			url: 'users/blocks',
			userId: extractUserId(user),
			scopes: ['user:read:blocked_users'],
			query: {
				...createBroadcasterQuery(user),
				...createPaginationQuery(pagination),
			},
		});

		return createPaginatedResult(result, HelixUserBlock, this._client);
	}

	/**
	 * Creates a paginator for users blocked by the given user.
	 *
	 * @param user The user to get blocks for.
	 */
	getBlocksPaginated(user: UserIdResolvable): HelixPaginatedRequest<HelixUserBlockData, HelixUserBlock> {
		return new HelixPaginatedRequest(
			{
				url: 'users/blocks',
				userId: extractUserId(user),
				scopes: ['user:read:blocked_users'],
				query: createBroadcasterQuery(user),
			},
			this._client,
			data => new HelixUserBlock(data, this._client),
		);
	}

	/**
	 * Blocks the given user.
	 *
	 * @param broadcaster The user to add the block to.
	 * @param target The user to block.
	 * @param additionalInfo Additional info to give context to the block.
	 *
	 * @expandParams
	 */
	async createBlock(
		broadcaster: UserIdResolvable,
		target: UserIdResolvable,
		additionalInfo: HelixUserBlockAdditionalInfo = {},
	): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'users/blocks',
			method: 'PUT',
			userId: extractUserId(broadcaster),
			scopes: ['user:manage:blocked_users'],
			query: createUserBlockCreateQuery(target, additionalInfo),
		});
	}

	/**
	 * Unblocks the given user.
	 *
	 * @param broadcaster The user to remove the block from.
	 * @param target The user to unblock.
	 */
	async deleteBlock(broadcaster: UserIdResolvable, target: UserIdResolvable): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'users/blocks',
			method: 'DELETE',
			userId: extractUserId(broadcaster),
			scopes: ['user:manage:blocked_users'],
			query: createUserBlockDeleteQuery(target),
		});
	}

	/**
	 * Gets a list of all extensions for the given authenticated user.
	 *
	 * @param broadcaster The broadcaster to get the list of extensions for.
	 * @param withInactive Whether to include inactive extensions.
	 */
	async getExtensionsForAuthenticatedUser(
		broadcaster: UserIdResolvable,
		withInactive = false,
	): Promise<HelixUserExtension[]> {
		const result = await this._client.callApi<HelixResponse<HelixUserExtensionData>>({
			type: 'helix',
			url: 'users/extensions/list',
			userId: extractUserId(broadcaster),
			scopes: withInactive ? ['channel:manage:extensions'] : ['user:read:broadcast', 'channel:manage:extensions'],
		});

		return result.data.map(data => new HelixUserExtension(data));
	}

	/**
	 * Gets a list of all installed extensions for the given user.
	 *
	 * @param user The user to get the installed extensions for.
	 * @param withDev Whether to include extensions that are in development.
	 */
	async getActiveExtensions(user: UserIdResolvable, withDev = false): Promise<HelixInstalledExtensionList> {
		const userId = extractUserId(user);
		const result = await this._client.callApi<{ data: HelixInstalledExtensionListData }>({
			type: 'helix',
			url: 'users/extensions',
			userId,
			scopes: withDev ? ['user:read:broadcast', 'channel:manage:extensions'] : undefined,
			query: createSingleKeyQuery('user_id', userId),
		});

		return new HelixInstalledExtensionList(result.data);
	}

	/**
	 * Updates the installed extensions for the given authenticated user.
	 *
	 * @param broadcaster The user to update the installed extensions for.
	 * @param data The extension installation payload.
	 *
	 * The format is shown on the [Twitch documentation](https://dev.twitch.tv/docs/api/reference#update-user-extensions).
	 * Don't use the "data" wrapper though.
	 */
	async updateActiveExtensionsForAuthenticatedUser(
		broadcaster: UserIdResolvable,
		data: HelixUserExtensionUpdatePayload,
	): Promise<HelixInstalledExtensionList> {
		const result = await this._client.callApi<{ data: HelixInstalledExtensionListData }>({
			type: 'helix',
			url: 'users/extensions',
			method: 'PUT',
			userId: extractUserId(broadcaster),
			scopes: ['channel:manage:extensions'],
			jsonBody: { data },
		});

		return new HelixInstalledExtensionList(result.data);
	}

	private async _getUsers(lookupType: UserLookupType, param: string[]) {
		if (param.length === 0) {
			return [];
		}
		const query: Record<string, string | string[] | undefined> = { [lookupType]: param };
		const result = await this._client.callApi<HelixPaginatedResponse<HelixUserData>>({
			type: 'helix',
			url: 'users',
			query,
		});

		return result.data.map(userData => new HelixUser(userData, this._client));
	}
}
