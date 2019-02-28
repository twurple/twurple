import BaseAPI from '../../BaseAPI';
import { Cacheable, Cached } from '../../../Toolkit/Decorators/Cache';
import { extractUserId, UserIdResolvable } from '../../../Toolkit/UserTools';
import { ChatEmoteData } from './ChatEmote';
import ChatEmoteList from './ChatEmoteList';
import ChatRoom, { ChatRoomData } from './ChatRoom';

/**
 * The API methods that deal with chat and chatrooms.
 *
 * Can be accessed using `client.kraken.chat` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = TwitchClient.withCredentials(clientId, accessToken);
 * const channel = await client.kraken.chat.getBadges('125328655');
 * ```
 */
@Cacheable
export default class ChatAPI extends BaseAPI {
	/**
	 * Retrieves all globally applicable chat badges.
	 *
	 * @deprecated Use {@BadgesAPI#getGlobalBadges} instead.
	 */
	async getGlobalBadges() {
		return this._client.badges.getGlobalBadges();
	}

	/**
	 * Retrieves all applicable chat badges for a given channel.
	 *
	 * @deprecated Use {@BadgesAPI#getGlobalBadges} instead.
	 *
	 * @param channel The channel to retrieve the chat badges for.
	 * @param includeGlobal Whether to include global badges in the result list.
	 */
	async getChannelBadges(channel: UserIdResolvable, includeGlobal: boolean = true) {
		return this._client.badges.getChannelBadges(channel, includeGlobal);
	}

	/**
	 * Retrieves a list of emotes for a given list of enote set IDs.
	 *
	 * @param emotesets The list of emote set IDs, either as array of strings or as a comma separated string.
	 */
	@Cached(3600)
	async getEmotesBySets(emotesets: string[] | string) {
		if (typeof emotesets !== 'string') {
			emotesets = emotesets.join(',');
		}

		const data = await this._client.callAPI<{ emoticons: ChatEmoteData[] }>({
			url: 'chat/emoticon_images',
			query: {
				emotesets
			}
		});

		return new ChatEmoteList(data.emoticons, this._client);
	}

	/**
	 * Retrieves a list of chat rooms for a given channel.
	 *
	 * @param channel The channel to retrieve the chat rooms of.
	 */
	@Cached(3600)
	async getChatRoomsForChannel(channel: UserIdResolvable) {
		const data = await this._client.callAPI<{ rooms: ChatRoomData[] }>({
			url: `chat/${extractUserId(channel)}/rooms`
		});

		return data.rooms.map(room => new ChatRoom(room, this._client));
	}
}
