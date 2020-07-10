import { Cacheable, Cached } from '@d-fischer/cache-decorators';
import { extractUserId, UserIdResolvable } from '../../Toolkit/UserTools';
import { TwitchApiCallType } from '../../TwitchClient';
import { BaseApi } from '../BaseApi';
import { ChatBadgeList, ChatBadgeListData } from './ChatBadgeList';

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
export class BadgesApi extends BaseApi {
	/**
	 * Retrieves all globally applicable chat badges.
	 *
	 * @param language The language of the retrieved badge descriptions.
	 */
	@Cached(3600)
	async getGlobalBadges(language?: string) {
		const data = await this._client.callApi<{ badge_sets: ChatBadgeListData }>({
			url: 'https://badges.twitch.tv/v1/badges/global/display',
			query: {
				language
			},
			type: TwitchApiCallType.Custom
		});

		return new ChatBadgeList(data.badge_sets, this._client);
	}

	/**
	 * Retrieves all applicable chat badges for a given channel.
	 *
	 * @param channel The channel to retrieve the chat badges for.
	 * @param includeGlobal Whether to include global badges in the result list.
	 * @param language The language of the retrieved badge descriptions.
	 */
	@Cached(3600)
	async getChannelBadges(channel: UserIdResolvable, includeGlobal: boolean = true, language?: string) {
		const data = await this._client.callApi<{ badge_sets: ChatBadgeListData }>({
			url: `https://badges.twitch.tv/v1/badges/channels/${extractUserId(channel)}/display`,
			query: {
				language
			},
			type: TwitchApiCallType.Custom
		});

		const channelBadges = new ChatBadgeList(data.badge_sets, this._client);

		if (includeGlobal) {
			return (await this.getGlobalBadges(language))._merge(channelBadges);
		}

		return channelBadges;
	}
}
