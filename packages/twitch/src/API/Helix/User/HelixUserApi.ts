import { TwitchApiCallType } from 'twitch-api-call';
import { HellFreezesOverError } from '../../../Errors/HellFreezesOverError';
import type { UserIdResolvable, UserNameResolvable } from '../../../Toolkit/UserTools';
import { extractUserId, extractUserName } from '../../../Toolkit/UserTools';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequestWithTotal } from '../HelixPaginatedRequestWithTotal';
import type { HelixPaginatedResultWithTotal } from '../HelixPaginatedResult';
import { createPaginatedResultWithTotal } from '../HelixPaginatedResult';
import type { HelixPaginatedResponse, HelixPaginatedResponseWithTotal, HelixResponse } from '../HelixResponse';
import type { HelixFollowData, HelixFollowFilter } from './HelixFollow';
import { HelixFollow } from './HelixFollow';
import type { HelixPrivilegedUserData } from './HelixPrivilegedUser';
import { HelixPrivilegedUser } from './HelixPrivilegedUser';
import type { HelixUserData } from './HelixUser';
import { HelixUser } from './HelixUser';

/** @private */
export enum UserLookupType {
	Id = 'id',
	Login = 'login'
}

/**
 * User data to update using {@HelixUserApi#updateUser}.
 */
export interface HelixUserUpdate {
	description?: string;
}

/**
 * The Helix API methods that deal with users.
 *
 * Can be accessed using `client.helix.users` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const client = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const user = await client.helix.users.getUserById('125328655');
 * ```
 */
export class HelixUserApi extends BaseApi {
	/**
	 * Retrieves the user data for the given list of user IDs.
	 *
	 * @param userIds The user IDs you want to look up.
	 */
	async getUsersByIds(userIds: UserIdResolvable[]): Promise<HelixUser[]> {
		return this._getUsers(UserLookupType.Id, userIds.map(extractUserId));
	}

	/**
	 * Retrieves the user data for the given list of user names.
	 *
	 * @param userNames The user names you want to look up.
	 */
	async getUsersByNames(userNames: UserNameResolvable[]): Promise<HelixUser[]> {
		return this._getUsers(UserLookupType.Login, userNames.map(extractUserName));
	}

	/**
	 * Retrieves the user data for the given user ID.
	 *
	 * @param userId The user ID you want to look up.
	 */
	async getUserById(userId: UserIdResolvable): Promise<HelixUser | null> {
		const users = await this._getUsers(UserLookupType.Id, extractUserId(userId));
		return users.length ? users[0] : null;
	}

	/**
	 * Retrieves the user data for the given user name.
	 *
	 * @param userName The user name you want to look up.
	 */
	async getUserByName(userName: UserNameResolvable): Promise<HelixUser | null> {
		const users = await this._getUsers(UserLookupType.Login, extractUserName(userName));
		return users.length ? users[0] : null;
	}

	/**
	 * Retrieves the user data of the currently authenticated user.
	 *
	 * @param withEmail Whether you need the user's email address.
	 */
	async getMe(withEmail: boolean = false): Promise<HelixPrivilegedUser> {
		const result = await this._client.callApi<HelixResponse<HelixPrivilegedUserData>>({
			type: TwitchApiCallType.Helix,
			url: 'users',
			scope: withEmail ? 'user:read:email' : ''
		});

		if (!result.data || !result.data.length) {
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
			type: TwitchApiCallType.Helix,
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
	 * @param filter Several filtering and pagination parameters. See the {@HelixFollowFilter} documentation.
	 */
	async getFollows(filter: HelixFollowFilter): Promise<HelixPaginatedResultWithTotal<HelixFollow>> {
		const query = HelixUserApi._makeFollowsQuery(filter);

		const result = await this._client.callApi<HelixPaginatedResponseWithTotal<HelixFollowData>>({
			url: 'users/follows',
			type: TwitchApiCallType.Helix,
			query
		});

		return createPaginatedResultWithTotal(result, HelixFollow, this._client);
	}

	/**
	 * Creates a paginator for follow relations.
	 *
	 * @param filter Several filtering and pagination parameters. See the {@HelixFollowFilter} documentation.
	 */
	getFollowsPaginated(filter: HelixFollowFilter): HelixPaginatedRequestWithTotal<HelixFollowData, HelixFollow> {
		const query = HelixUserApi._makeFollowsQuery(filter);

		return new HelixPaginatedRequestWithTotal(
			{
				url: 'users/follows',
				query
			},
			this._client,
			(data: HelixFollowData) => new HelixFollow(data, this._client)
		);
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

	private async _getUsers(lookupType: UserLookupType, param: string | string[]) {
		// #157: return empty early to prevent token based lookup
		if (Array.isArray(param) && param.length === 0) {
			return [];
		}
		const query: Record<string, string | string[] | undefined> = { [lookupType]: param };
		const result = await this._client.callApi<HelixPaginatedResponse<HelixUserData>>({
			type: TwitchApiCallType.Helix,
			url: 'users',
			query
		});

		return result.data.map(userData => new HelixUser(userData, this._client));
	}
}
