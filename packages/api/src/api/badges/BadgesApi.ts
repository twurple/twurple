import { extractUserId, rtfm, type UserIdResolvable } from '@twurple/common';
import { type ChatBadgeResultData } from '../../interfaces/badges.external';
import { BaseApi } from '../BaseApi';
import { ChatBadgeList } from './ChatBadgeList';

/**
 * The API methods that deal with badges.
 *
 * Can be accessed using `client.badges` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const cheermotes = await api.badges.getGlobalBadges();
 * ```
 *
 * @deprecated Use {@link HelixChatApi}'s badge methods instead.
 *
 * @meta category misc
 * @meta categorizedTitle Badges (deprecated)
 */
@rtfm('api', 'BadgesApi')
export class BadgesApi extends BaseApi {
	/**
	 * Retrieves all globally applicable chat badges.
	 *
	 * @param language The language of the retrieved badge descriptions.
	 */
	async getGlobalBadges(language?: string): Promise<ChatBadgeList> {
		const data = await this._client.callApi<ChatBadgeResultData>({
			type: 'custom',
			url: 'https://badges.twitch.tv/v1/badges/global/display',
			query: {
				language
			}
		});

		return new ChatBadgeList(data.badge_sets);
	}

	/**
	 * Retrieves all applicable chat badges for a given channel.
	 *
	 * @param channel The channel to retrieve the chat badges for.
	 * @param includeGlobal Whether to include global badges in the result list.
	 * @param language The language of the retrieved badge descriptions.
	 */
	async getChannelBadges(
		channel: UserIdResolvable,
		includeGlobal: boolean = true,
		language?: string
	): Promise<ChatBadgeList> {
		const data = await this._client.callApi<ChatBadgeResultData>({
			type: 'custom',
			url: `https://badges.twitch.tv/v1/badges/channels/${extractUserId(channel)}/display`,
			query: {
				language
			}
		});

		const channelBadges = new ChatBadgeList(data.badge_sets);

		if (includeGlobal) {
			return (await this.getGlobalBadges(language))._merge(channelBadges);
		}

		return channelBadges;
	}
}
