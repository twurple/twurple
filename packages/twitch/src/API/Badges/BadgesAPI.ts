import { Cacheable, Cached } from '@d-fischer/cache-decorators';
import { extractUserId, UserIdResolvable } from '../../Toolkit/UserTools';
import { TwitchAPICallType } from '../../TwitchClient';
import BaseAPI from '../BaseAPI';
import ChatBadgeList, { ChatBadgeListData } from './ChatBadgeList';

/**
 * The API methods that deal with badges.
 *
 * Can be accessed using `client.badges` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = TwitchClient.withCredentials(clientId, accessToken);
 * const cheermotes = await client.badges.getGlobalBadges();
 * ```
 */
@Cacheable
export default class BadgesAPI extends BaseAPI {
	/**
	 * Retrieves all globally applicable chat badges.
	 */
	@Cached(3600)
	async getGlobalBadges(language?: string) {
		const data = await this._client.callAPI<{ badge_sets: ChatBadgeListData }>({
			url: 'https://badges.twitch.tv/v1/badges/global/display',
			query: {
				language
			},
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
	async getChannelBadges(channel: UserIdResolvable, includeGlobal: boolean = true, language?: string) {
		const data = await this._client.callAPI<{ badge_sets: ChatBadgeListData }>({
			url: `https://badges.twitch.tv/v1/badges/channels/${extractUserId(channel)}/display`,
			query: {
				language
			},
			type: TwitchAPICallType.Custom
		});

		const channelBadges = new ChatBadgeList(data.badge_sets, this._client);

		if (includeGlobal) {
			return (await this.getGlobalBadges(language))._merge(channelBadges);
		}

		return channelBadges;
	}
}
