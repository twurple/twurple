import { Cacheable, Cached } from '@d-fischer/cache-decorators';
import { rtfm } from 'twitch-common';
import type { UserIdResolvable } from '../../../Toolkit/UserTools';
import { extractUserId } from '../../../Toolkit/UserTools';
import { BaseApi } from '../../BaseApi';
import type { ChatEmoteData } from './ChatEmote';
import { ChatEmoteList } from './ChatEmoteList';
import type { ChatRoomData } from './ChatRoom';
import { ChatRoom } from './ChatRoom';

/**
 * The API methods that deal with chat and chatrooms.
 *
 * Can be accessed using `client.kraken.chat` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const emotes = await api.kraken.chat.getEmotesBySets('1');
 * ```
 */
@Cacheable
@rtfm('twitch', 'ChatApi')
export class ChatApi extends BaseApi {
	/**
	 * Retrieves a list of emotes for a given list of enote set IDs.
	 *
	 * @param emotesets The list of emote set IDs, either as array of strings or as a comma separated string.
	 */
	@Cached(3600)
	async getEmotesBySets(emotesets: string[] | string): Promise<ChatEmoteList> {
		if (typeof emotesets !== 'string') {
			emotesets = emotesets.join(',');
		}

		const data = await this._client.callApi<{ emoticons: ChatEmoteData[] }>({
			url: 'chat/emoticon_images',
			query: {
				emotesets
			}
		});

		return new ChatEmoteList(data.emoticons);
	}

	/**
	 * Retrieves a list of chat rooms for a given channel.
	 *
	 * @param channel The channel to retrieve the chat rooms of.
	 */
	@Cached(3600)
	async getChatRoomsForChannel(channel: UserIdResolvable): Promise<ChatRoom[]> {
		const data = await this._client.callApi<{ rooms: ChatRoomData[] }>({
			url: `chat/${extractUserId(channel)}/rooms`
		});

		return data.rooms.map(room => new ChatRoom(room, this._client));
	}
}
