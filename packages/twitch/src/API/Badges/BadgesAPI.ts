import BaseAPI from '../BaseAPI';
import { Cacheable, Cached } from '../../Toolkit/Decorators/Cache';
import ChatBadgeList, { ChatBadgeListData } from './ChatBadgeList';
import { TwitchAPICallType } from '../../TwitchClient';
import { extractUserId, UserIdResolvable } from '../../Toolkit/UserTools';

/**
 * The API methods that deal with badges.
 *
 * Can be accessed using `client.badges` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = await TwitchClient.withCredentials(clientId, accessToken);
 * const cheermotes = await client.badges.getGlobalBadges();
 * ```
 */
@Cacheable
export default class BadgesAPI extends BaseAPI {
	/**
	 * Retrieves all globally applicable chat badges.
	 */
	@Cached(3600)
	async getGlobalBadges() {
		const data = await this._client.callAPI<{ badge_sets: ChatBadgeListData }>({
			url: 'https://badges.twitch.tv/v1/badges/global/display',
			type: TwitchAPICallType.Custom
		});

		return new ChatBadgeList(data.badge_sets, this._client);
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
			url: `https://badges.twitch.tv/v1/badges/channels/${extractUserId(channel)}/display`,
			type: TwitchAPICallType.Custom
		});

		const channelBadges = new ChatBadgeList(data.badge_sets, this._client);

		if (includeGlobal) {
			return channelBadges._merge(await this.getGlobalBadges());
		}

		return channelBadges;
	}
}
