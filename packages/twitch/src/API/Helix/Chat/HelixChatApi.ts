import { TwitchApiCallType } from 'twitch-api-call';
import type { UserIdResolvable } from 'twitch-common';
import { extractUserId, rtfm } from 'twitch-common';
import { BaseApi } from '../../BaseApi';
import type { HelixResponse } from '../HelixResponse';
import type { HelixChatBadgeSetData } from './HelixChatBadgeSet';
import { HelixChatBadgeSet } from './HelixChatBadgeSet';

/**
 * The Helix API methods that deal with chat.
 *
 * Can be accessed using `client.helix.chat` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const rewards = await api.helix.chat.getChannelBadges('125328655');
 * ```
 */
@rtfm('twitch', 'HelixChatApi')
export class HelixChatApi extends BaseApi {
	/**
	 * Retrieves all global badges.
	 */
	async getGlobalBadges(): Promise<HelixChatBadgeSet[]> {
		const result = await this._client.callApi<HelixResponse<HelixChatBadgeSetData>>({
			type: TwitchApiCallType.Helix,
			url: 'chat/badges/global'
		});

		return result.data.map(data => new HelixChatBadgeSet(data));
	}

	/**
	 * Retrieves all badges specific to the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to retrieve badges for.
	 */
	async getChannelBadges(broadcaster: UserIdResolvable): Promise<HelixChatBadgeSet[]> {
		const result = await this._client.callApi<HelixResponse<HelixChatBadgeSetData>>({
			type: TwitchApiCallType.Helix,
			url: 'chat/badges',
			query: {
				broadcaster_id: extractUserId(broadcaster)
			}
		});

		return result.data.map(data => new HelixChatBadgeSet(data));
	}
}
