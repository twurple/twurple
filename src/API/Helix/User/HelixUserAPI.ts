import BaseAPI from '../../BaseAPI';
import { UniformObject } from '../../../Toolkit/ObjectTools';
import HelixResponse, { HelixPaginatedResponse } from '../HelixResponse';
import HelixUser, { HelixUserData } from './HelixUser';
import HelixPrivilegedUser, { HelixPrivilegedUserData } from './HelixPrivilegedUser';
import UserTools, { UserIdResolvable, UserNameResolvable } from '../../../Toolkit/UserTools';
import HelixFollow, { HelixFollowData, HelixFollowFilter } from './HelixFollow';
import { TwitchAPICallType } from '../../../TwitchClient';
import HelixPaginatedRequest from '../HelixPaginatedRequest';

/** @private */
export enum UserLookupType {
	Id = 'id',
	Login = 'login'
}

/**
 * User data to update using {@HelixUserAPI#updateUser}.
 */
export interface HelixUserUpdate {
	description?: string;
}

/**
 * The Helix API methods that deal with users.
 *
 * Can be accessed using `client.helix.users` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = new TwitchClient(options);
 * const user = await client.helix.users.getUserById('125328655');
 * ```
 */
export default class HelixUserAPI extends BaseAPI {
	private async _getUsers(lookupType: UserLookupType, param: string | string[]) {
		const query: UniformObject<string | string[] | undefined> = { [lookupType]: param };
		const result = await this._client.callAPI<HelixPaginatedResponse<HelixUserData>>({
			type: TwitchAPICallType.Helix,
			url: 'users',
			query
		});

		return result.data.map(userData => new HelixUser(userData, this._client));
	}

	/**
	 * Retrieves the user data for the given list of user IDs.
	 *
	 * @param userIds The user IDs you want to look up.
	 */
	async getUsersByIds(userIds: UserIdResolvable[]) {
		return this._getUsers(UserLookupType.Id, userIds.map(id => UserTools.getUserId(id)));
	}

	/**
	 * Retrieves the user data for the given list of user names.
	 *
	 * @param userNames The user names you want to look up.
	 */
	async getUsersByNames(userNames: UserNameResolvable[]) {
		return this._getUsers(UserLookupType.Login, userNames.map(name => UserTools.getUserName(name)));
	}

	/**
	 * Retrieves the user data for the given user ID.
	 *
	 * @param userId The user ID you want to look up.
	 */
	async getUserById(userId: UserIdResolvable) {
		const users = await this._getUsers(UserLookupType.Id, UserTools.getUserId(userId));
		if (!users.length) {
			throw new Error('user not found');
		}
		return users[0];
	}

	/**
	 * Retrieves the user data for the given user name.
	 *
	 * @param userName The user name you want to look up.
	 */
	async getUserByName(userName: UserNameResolvable) {
		const users = await this._getUsers(UserLookupType.Login, UserTools.getUserName(userName));
		if (!users.length) {
			throw new Error('user not found');
		}
		return users[0];
	}

	/**
	 * Retrieves the user data of the currently authenticated user.
	 *
	 * @param withEmail Whether you need the user's email address.
	 */
	async getMe(withEmail: boolean = false) {
		const result = await this._client.callAPI<HelixResponse<HelixPrivilegedUserData>>({
			type: TwitchAPICallType.Helix,
			url: 'users',
			scope: withEmail ? 'user:read:email' : ''
		});

		if (!result.data || !result.data.length) {
			throw new Error('could not get authenticated user');
		}

		return new HelixPrivilegedUser(result.data[0], this._client);
	}

	/**
	 * Updates the currently authenticated user's data.
	 *
	 * @param data The data to update.
	 */
	async updateUser(data: HelixUserUpdate) {
		const result = await this._client.callAPI<HelixResponse<HelixPrivilegedUserData>>({
			type: TwitchAPICallType.Helix,
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
	getFollows(filter: HelixFollowFilter) {
		const query: UniformObject<string | undefined> = {};
		let hasUserIdParam = false;
		if (filter.user) {
			query.from_id = UserTools.getUserId(filter.user);
			hasUserIdParam = true;
		}
		if (filter.followedUser) {
			query.to_id = UserTools.getUserId(filter.followedUser);
			hasUserIdParam = true;
		}

		if (!hasUserIdParam) {
			throw new TypeError('At least one of user and followedUser have to be set');
		}

		return new HelixPaginatedRequest(
			{
				type: TwitchAPICallType.Helix,
				url: 'users/follows',
				query
			},
			this._client,
			(data: HelixFollowData) => new HelixFollow(data, this._client)
		);
	}
}
