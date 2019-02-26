import BaseAPI from '../BaseAPI';
import { Cacheable, Cached } from '../../Toolkit/Decorators';
import { TwitchAPICallType } from '../../TwitchClient';
import UserTools, { UserIdResolvable } from '../../Toolkit/UserTools';
import ChatBadgeList, { ChatBadgeListData } from './ChatBadgeList';
import { ChatEmoteData } from './ChatEmote';
import ChatEmoteList from './ChatEmoteList';
import ChatRoom, { ChatRoomData } from './ChatRoom';

/**
 * The API methods that deal with chat and chatrooms.
 *
 * Can be accessed using `client.chat` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = new TwitchClient(options);
 * const channel = await client.chat.getBadges('125328655');
 * ```
 */
@Cacheable
export default class ChatAPI extends BaseAPI {
	/**
	 * Retrieves all globally applicable chat badges.
	 */
	@Cached(3600)
	async getGlobalBadges() {
		const data = await this._client.callAPI<ChatBadgeListData>({
			url: 'https://badges.twitch.tv/v1/badges/global/display',
			type: TwitchAPICallType.Custom
		});

		return new ChatBadgeList(data, this._client);
	}

	/**
	 * Retrieves all applicable chat badges for a given channel.
	 *
	 * @param channel The channel to retrieve the chat badges for.
	 * @param includeGlobal Whether to include global badges in the result list.
	 */
	@Cached(3600)
	async getChannelBadges(channel: UserIdResolvable, includeGlobal: boolean = true) {
		const data = await this._client.callAPI<{ badge_sets: ChatBadgeListData }>({
			url: `https://badges.twitch.tv/v1/badges/channels/${UserTools.getUserId(channel)}/display`,
			type: TwitchAPICallType.Custom
		});

		const channelBadges = new ChatBadgeList(data.badge_sets, this._client);

		if (includeGlobal) {
			return channelBadges._merge(await this.getGlobalBadges());
		}

		return channelBadges;
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
			url: `chat/${UserTools.getUserId(channel)}/rooms`
		});

		return data.rooms.map(room => new ChatRoom(room, this._client));
	}
}
