import { Cacheable, Cached } from '@d-fischer/cache-decorators';
import { TwitchApiCallType } from 'twitch-api-call';
import type { UserIdResolvable } from '../../Toolkit/UserTools';
import { extractUserId } from '../../Toolkit/UserTools';
import { BaseApi } from '../BaseApi';
import type { ChatBadgeListData } from './ChatBadgeList';
import { ChatBadgeList } from './ChatBadgeList';

/**
 * The API methods that deal with badges.
 *
 * Can be accessed using `client.badges` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const cheermotes = await api.badges.getGlobalBadges();
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
	async getGlobalBadges(language?: string): Promise<ChatBadgeList> {
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
	async getChannelBadges(
		channel: UserIdResolvable,
		includeGlobal: boolean = true,
		language?: string
	): Promise<ChatBadgeList> {
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
