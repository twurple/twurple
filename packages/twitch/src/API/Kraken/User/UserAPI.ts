import { Cacheable, Cached, CacheEntry, ClearsCache } from '@d-fischer/cache-decorators';
import { entriesToObject, indexBy, mapObject } from '@d-fischer/shared-utils';
import HellFreezesOverError from '../../../Errors/HellFreezesOverError';
import HTTPStatusCodeError from '../../../Errors/HTTPStatusCodeError';
import NoSubscriptionProgramError from '../../../Errors/NoSubscriptionProgramError';
import { extractUserId, UserIdResolvable } from '../../../Toolkit/UserTools';
import BaseAPI from '../../BaseAPI';
import EmoteSetList from '../Channel/EmoteSetList';
import PrivilegedUser from './PrivilegedUser';
import User, { UserData } from './User';
import UserBlock, { UserBlockData } from './UserBlock';
import UserChatInfo, { UserChatInfoData } from './UserChatInfo';
import UserFollow, { UserFollowData } from './UserFollow';
import UserSubscription from './UserSubscription';

/**
 * The API methods that deal with users.
 *
 * Can be accessed using `client.kraken.users` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = TwitchClient.withCredentials(clientId, accessToken);
 * const user = await client.kraken.users.getUser('125328655');
 * ```
 */
@Cacheable
export default class UserAPI extends BaseAPI {
	private readonly _userByNameCache: Map<string, CacheEntry<User>> = new Map();

	/**
	 * Retrieves the user data of the currently authenticated user.
	 */
	@Cached(3600)
	async getMe() {
		return new PrivilegedUser(await this._client.callAPI({ url: 'user', scope: 'user_read' }), this._client);
	}

	/**
	 * Retrieves the user data for the given user ID.
	 *
	 * @param userId The user ID you want to look up.
	 */
	@Cached(3600)
	async getUser(userId: UserIdResolvable) {
		const userData = await this._client.callAPI({ url: `users/${extractUserId(userId)}` });
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
	async getUserByName(userName: string) {
		// not using the decorator's cache here as users-by-name is slightly more complex to cache
		this._cleanUserCache();
		if (this._userByNameCache.has(userName)) {
			return this._userByNameCache.get(userName)!.value;
		}
		const { users } = await this._client.callAPI({ url: 'users', query: { login: userName } });
		if (users.length === 0) {
			return null;
		}
		const user = new User(users[0], this._client);
		this._userByNameCache.set(userName, {
			value: user,
			expires: Date.now() + 3600 * 1000
		});
		return user;
	}

	/**
	 * Retrieves the user data for the given user names.
	 *
	 * @param userNames The user names you want to look up.
	 */
	async getUsersByNames(userNames: string[]): Promise<Record<string, User>> {
		this._cleanUserCache();
		userNames = userNames.map(name => name.toLowerCase());
		const cachedEntries = Array.from(this._userByNameCache.entries()).filter(([key]) => userNames.includes(key));
		const cachedObject = entriesToObject(cachedEntries);
		const cachedUsers = mapObject(cachedObject, (entry: CacheEntry<User>) => entry.value);
		const toFetch = userNames.filter(name => !(name in cachedUsers));
		if (!toFetch.length) {
			return cachedUsers;
		}
		const usersData = await this._client.callAPI({ url: 'users', query: { login: toFetch.join(',') } });
		const usersArr: User[] = usersData.users.map((data: UserData) => new User(data, this._client));
		usersArr.forEach(user =>
			this._userByNameCache.set(user.name, {
				value: user,
				expires: Date.now() + 3600 * 1000
			})
		);
		const users = indexBy(usersArr, 'name');

		return { ...cachedUsers, ...users };
	}

	/**
	 * Retrieves information about the user's chat appearance and privileges.
	 *
	 * @param user The user you want to get chat info for.
	 */
	@Cached(3600)
	async getChatInfo(user: UserIdResolvable) {
		const userId = extractUserId(user);

		const data = await this._client.callAPI<UserChatInfoData>({ url: `users/${userId}/chat` });
		return new UserChatInfo(data, this._client);
	}

	/**
	 * Retrieves the emotes a given user can use.
	 *
	 * @param user The user you want to get emotes for.
	 */
	@Cached(3600)
	async getUserEmotes(user: UserIdResolvable) {
		const userId = extractUserId(user);

		const data = await this._client.callAPI({ url: `users/${userId}/emotes`, scope: 'user_subscriptions' });
		return new EmoteSetList(data.emoticon_sets);
	}

	/**
	 * Retrieves the subscription data for a given user to a given channel.
	 *
	 * @param user The user to retrieve the subscription data of.
	 * @param toChannel The channel you want to retrieve the subscription data to.
	 */
	@Cached(3600)
	async getSubscriptionData(user: UserIdResolvable, toChannel: UserIdResolvable) {
		const userId = extractUserId(user);
		const channelId = extractUserId(toChannel);

		try {
			return new UserSubscription(
				await this._client.callAPI({
					url: `users/${userId}/subscriptions/${channelId}`,
					scope: 'user_subscriptions'
				}),
				this._client
			);
		} catch (e) {
			if (e instanceof HTTPStatusCodeError) {
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
	@Cached(300)
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

		const data = await this._client.callAPI({
			url: `users/${userId}/follows/channels`,
			query
		});

		return data.follows.map((follow: UserFollowData) => new UserFollow(follow, this._client));
	}

	/**
	 * Get follow data for a given user to a given channel.
	 *
	 * @param user The user you want to retrieve follow data of.
	 * @param channel The channel you want to retrieve follow data to.
	 */
	@Cached(300)
	async getFollowedChannel(user: UserIdResolvable, channel: UserIdResolvable) {
		const userId = extractUserId(user);
		const channelId = extractUserId(channel);
		try {
			const data = await this._client.callAPI({ url: `users/${userId}/follows/channels/${channelId}` });
			return new UserFollow(data, this._client);
		} catch (e) {
			if (e instanceof HTTPStatusCodeError) {
				if (e.statusCode === 404) {
					return null;
				}
			}

			throw e;
		}
	}

	/**
	 * Follows a given channel with a given user.
	 *
	 * @param user The user you want to follow with.
	 * @param channel The channel to follow.
	 * @param notifications Whether the user will receive notifications.
	 */
	@ClearsCache<UserAPI>('getFollowedChannels', 1)
	@ClearsCache<UserAPI>('getFollowedChannel', 2)
	async followChannel(user: UserIdResolvable, channel: UserIdResolvable, notifications?: boolean) {
		const userId = extractUserId(user);
		const channelId = extractUserId(channel);
		const data = await this._client.callAPI({
			url: `users/${userId}/follows/channels/${channelId}`,
			method: 'PUT',
			scope: 'user_follows_edit',
			body: { notifications: Boolean(notifications).toString() }
		});
		return new UserFollow(data, this._client);
	}

	/**
	 * Unfollows a given channel with a given user.
	 *
	 * @param user The user you want to unfollow with.
	 * @param channel The channel to unfollow.
	 */
	@ClearsCache<UserAPI>('getFollowedChannels', 1)
	@ClearsCache<UserAPI>('getFollowedChannel', 2)
	async unfollowChannel(user: UserIdResolvable, channel: UserIdResolvable) {
		const userId = extractUserId(user);
		const channelId = extractUserId(channel);
		await this._client.callAPI({
			url: `users/${userId}/follows/channels/${channelId}`,
			scope: 'user_follows_edit',
			method: 'DELETE'
		});
	}

	/**
	 * Retrieves a list of users a given user has blocked.
	 *
	 * @param user The user you want to retrieve the block list of.
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 */
	@Cached(3600)
	async getBlockedUsers(user: UserIdResolvable, page?: number, limit: number = 25): Promise<UserBlock[]> {
		const userId = extractUserId(user);
		const query: Record<string, string> = { limit: limit.toString() };

		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		const data = await this._client.callAPI({
			url: `users/${userId}/blocks`,
			query,
			scope: 'user_blocks_read'
		});

		return data.blocks.map((block: UserBlockData) => new UserBlock(block, this._client));
	}

	/**
	 * Blocks a given user with another given user.
	 *
	 * @param user The user you want to block with.
	 * @param userToBlock The user to block.
	 */
	@ClearsCache<UserAPI>('getBlockedUsers', 1)
	async blockUser(user: UserIdResolvable, userToBlock: UserIdResolvable) {
		const userId = extractUserId(user);
		const userIdToBlock = extractUserId(userToBlock);
		const data = await this._client.callAPI({
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
	@ClearsCache<UserAPI>('getBlockedUsers', 1)
	async unblockUser(user: UserIdResolvable, userToUnblock: UserIdResolvable) {
		const userId = extractUserId(user);
		const userIdToUnblock = extractUserId(userToUnblock);
		await this._client.callAPI({
			url: `users/${userId}/blocks/${userIdToUnblock}`,
			method: 'DELETE',
			scope: 'user_blocks_edit'
		});
	}

	private _cleanUserCache() {
		const now = Date.now();
		this._userByNameCache.forEach((val, key) => {
			if (val.expires < now) {
				this._userByNameCache.delete(key);
			}
		});
	}
}
