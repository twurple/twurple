import { indexBy } from '@d-fischer/shared-utils';
import { HttpStatusCodeError } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, HellFreezesOverError, rtfm } from '@twurple/common';
import { NoSubscriptionProgramError } from '../../../Errors/NoSubscriptionProgramError';
import { BaseApi } from '../../BaseApi';
import type { EmoteSetListData } from '../channel/EmoteSetList';
import { EmoteSetList } from '../channel/EmoteSetList';
import { PrivilegedUser } from './PrivilegedUser';
import type { UserData } from './User';
import { User } from './User';
import type { UserBlockData } from './UserBlock';
import { UserBlock } from './UserBlock';
import type { UserChatInfoData } from './UserChatInfo';
import { UserChatInfo } from './UserChatInfo';
import type { UserFollowData } from './UserFollow';
import { UserFollow } from './UserFollow';
import { UserSubscription } from './UserSubscription';

/**
 * The API methods that deal with users.
 *
 * Can be accessed using `client.kraken.users` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const user = await api.kraken.users.getUser('125328655');
 * ```
 */
@rtfm('api', 'UserApi')
export class UserApi extends BaseApi {
	/**
	 * Retrieves the user data of the currently authenticated user.
	 */
	async getMe(): Promise<PrivilegedUser> {
		return new PrivilegedUser(await this._client.callApi({ url: 'user', scope: 'user_read' }), this._client);
	}

	/**
	 * Retrieves the user data for the given user ID.
	 *
	 * @param userId The user ID you want to look up.
	 */
	async getUser(userId: UserIdResolvable): Promise<User> {
		const userData = await this._client.callApi<UserData>({ url: `users/${extractUserId(userId)}` });
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!userData) {
			throw new HellFreezesOverError('Could not get authenticated user');
		}
		return new User(userData, this._client);
	}

	/**
	 * Retrieves the user data for the given user name.
	 *
	 * @param userName The user name you want to look up.
	 */
	async getUserByName(userName: string): Promise<User | null> {
		const { users } = await this._client.callApi<{ users: UserData[] }>({
			url: 'users',
			query: { login: userName }
		});
		if (users.length === 0) {
			return null;
		}
		return new User(users[0], this._client);
	}

	/**
	 * Retrieves the user data for the given user names.
	 *
	 * @param userNames The user names you want to look up.
	 */
	async getUsersByNames(userNames: string[]): Promise<Record<string, User>> {
		userNames = userNames.map(name => name.toLowerCase());
		const usersData = await this._client.callApi<{ users: UserData[] }>({
			url: 'users',
			query: { login: userNames.join(',') }
		});
		const usersArr: User[] = usersData.users.map(data => new User(data, this._client));
		const users = indexBy(usersArr, 'name');

		return { ...users };
	}

	/**
	 * Retrieves information about the user's chat appearance and privileges.
	 *
	 * @param user The user you want to get chat info for.
	 */
	async getChatInfo(user: UserIdResolvable): Promise<UserChatInfo> {
		const userId = extractUserId(user);

		const data = await this._client.callApi<UserChatInfoData>({ url: `users/${userId}/chat` });
		return new UserChatInfo(data, this._client);
	}

	/**
	 * Retrieves the emotes a given user can use.
	 *
	 * @param user The user you want to get emotes for.
	 */
	async getUserEmotes(user: UserIdResolvable): Promise<EmoteSetList> {
		const userId = extractUserId(user);

		const data = await this._client.callApi<{ emoticon_sets: EmoteSetListData }>({
			url: `users/${userId}/emotes`,
			scope: 'user_subscriptions'
		});
		return new EmoteSetList(data.emoticon_sets);
	}

	/**
	 * Retrieves the subscription data for a given user to a given channel.
	 *
	 * @param user The user to retrieve the subscription data of.
	 * @param toChannel The channel you want to retrieve the subscription data to.
	 */
	async getSubscriptionData(user: UserIdResolvable, toChannel: UserIdResolvable): Promise<UserSubscription | null> {
		const userId = extractUserId(user);
		const channelId = extractUserId(toChannel);

		try {
			return new UserSubscription(
				await this._client.callApi({
					url: `users/${userId}/subscriptions/${channelId}`,
					scope: 'user_subscriptions'
				}),
				this._client
			);
		} catch (e) {
			if (e instanceof HttpStatusCodeError) {
				if (e.statusCode === 404) {
					return null;
				} else if (e.statusCode === 422) {
					throw new NoSubscriptionProgramError(channelId);
				}
			}

			throw e;
		}
	}

	/**
	 * Get a list of channels a given user follows.
	 *
	 * @param user The user you want to retrieve the follows of.
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 * @param orderBy The field to order by.
	 * @param orderDirection The direction to order in - ascending or descending.
	 */
	async getFollowedChannels(
		user: UserIdResolvable,
		page?: number,
		limit: number = 25,
		orderBy?: string,
		orderDirection?: 'asc' | 'desc'
	): Promise<UserFollow[]> {
		const userId = extractUserId(user);
		const query: Record<string, string> = {};

		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		query.limit = limit.toString();

		if (orderBy) {
			query.sortby = orderBy;
		}

		if (orderDirection) {
			query.direction = orderDirection;
		}

		const data = await this._client.callApi<{ follows: UserFollowData[] }>({
			url: `users/${userId}/follows/channels`,
			query
		});

		return data.follows.map(follow => new UserFollow(follow, this._client));
	}

	/**
	 * Get follow data for a given user to a given channel.
	 *
	 * @param user The user you want to retrieve follow data of.
	 * @param channel The channel you want to retrieve follow data to.
	 */
	async getFollowedChannel(user: UserIdResolvable, channel: UserIdResolvable): Promise<UserFollow | null> {
		const userId = extractUserId(user);
		const channelId = extractUserId(channel);
		try {
			const data = await this._client.callApi<UserFollowData>({
				url: `users/${userId}/follows/channels/${channelId}`
			});
			return new UserFollow(data, this._client);
		} catch (e) {
			if (e instanceof HttpStatusCodeError) {
				if (e.statusCode === 404) {
					return null;
				}
			}

			throw e;
		}
	}

	/**
	 * Retrieves a list of users a given user has blocked.
	 *
	 * @param user The user you want to retrieve the block list of.
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 */
	async getBlockedUsers(user: UserIdResolvable, page?: number, limit: number = 25): Promise<UserBlock[]> {
		const userId = extractUserId(user);
		const query: Record<string, string> = { limit: limit.toString() };

		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		const data = await this._client.callApi<{ blocks: UserBlockData[] }>({
			url: `users/${userId}/blocks`,
			query,
			scope: 'user_blocks_read'
		});

		return data.blocks.map(block => new UserBlock(block, this._client));
	}

	/**
	 * Blocks a given user with another given user.
	 *
	 * @param user The user you want to block with.
	 * @param userToBlock The user to block.
	 */
	async blockUser(user: UserIdResolvable, userToBlock: UserIdResolvable): Promise<UserBlock> {
		const userId = extractUserId(user);
		const userIdToBlock = extractUserId(userToBlock);
		const data = await this._client.callApi<UserBlockData>({
			url: `users/${userId}/blocks/${userIdToBlock}`,
			method: 'PUT',
			scope: 'user_blocks_edit'
		});
		return new UserBlock(data, this._client);
	}

	/**
	 * Unblocks a given user with another given user.
	 *
	 * @param user The user you want to unblock with.
	 * @param userToUnblock The user to unblock.
	 */
	async unblockUser(user: UserIdResolvable, userToUnblock: UserIdResolvable): Promise<void> {
		const userId = extractUserId(user);
		const userIdToUnblock = extractUserId(userToUnblock);
		await this._client.callApi({
			url: `users/${userId}/blocks/${userIdToUnblock}`,
			method: 'DELETE',
			scope: 'user_blocks_edit'
		});
	}
}
