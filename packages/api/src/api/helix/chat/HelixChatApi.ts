import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { BaseApi } from '../../BaseApi';
import type { HelixResponse } from '../HelixResponse';
import type { HelixChannelEmoteData } from './HelixChannelEmote';
import { HelixChannelEmote } from './HelixChannelEmote';
import type { HelixChatBadgeSetData } from './HelixChatBadgeSet';
import { HelixChatBadgeSet } from './HelixChatBadgeSet';
import type { HelixEmoteData } from './HelixEmote';
import { HelixEmote } from './HelixEmote';
import type { HelixEmoteFromSetData } from './HelixEmoteFromSet';
import { HelixEmoteFromSet } from './HelixEmoteFromSet';

/**
 * The Helix API methods that deal with chat.
 *
 * Can be accessed using `client.chat` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const rewards = await api.chat.getChannelBadges('125328655');
 * ```
 */
@rtfm('api', 'HelixChatApi')
export class HelixChatApi extends BaseApi {
	/**
	 * Retrieves all global badges.
	 */
	async getGlobalBadges(): Promise<HelixChatBadgeSet[]> {
		const result = await this._client.callApi<HelixResponse<HelixChatBadgeSetData>>({
			type: 'helix',
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
			type: 'helix',
			url: 'chat/badges',
			query: {
				broadcaster_id: extractUserId(broadcaster)
			}
		});

		return result.data.map(data => new HelixChatBadgeSet(data));
	}

	/**
	 * Retrieves all global emotes.
	 */
	async getGlobalEmotes(): Promise<HelixEmote[]> {
		const result = await this._client.callApi<HelixResponse<HelixEmoteData>>({
			type: 'helix',
			url: 'chat/emotes/global'
		});

		return result.data.map(data => new HelixEmote(data));
	}

	/**
	 * Retrieves all emotes from a channel.
	 *
	 * @param channel The channel to retrieve emotes from.
	 */
	async getChannelEmotes(channel: UserIdResolvable): Promise<HelixChannelEmote[]> {
		const result = await this._client.callApi<HelixResponse<HelixChannelEmoteData>>({
			type: 'helix',
			url: 'chat/emotes',
			query: {
				broadcaster_id: extractUserId(channel)
			}
		});

		return result.data.map(data => new HelixChannelEmote(data, this._client));
	}

	/**
	 * Retrieves all emotes from a list of emote sets.
	 *
	 * @param setIds The IDs of the emote sets to retrieve emotes from.
	 */
	async getEmotesFromSets(setIds: string[]): Promise<HelixEmoteFromSet[]> {
		const result = await this._client.callApi<HelixResponse<HelixEmoteFromSetData>>({
			type: 'helix',
			url: 'chat/emotes/set',
			query: {
				emote_set_id: setIds
			}
		});

		return result.data.map(data => new HelixEmoteFromSet(data, this._client));
	}
}
