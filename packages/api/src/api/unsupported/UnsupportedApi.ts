import type { UserNameResolvable } from '@twurple/common';
import { extractUserName, rtfm } from '@twurple/common';
import { type ChattersListData } from '../../interfaces/unsupported.external';
import { BaseApi } from '../BaseApi';
import { ChattersList } from './ChattersList';

/**
 * Miscellaneous API methods that are not officially supported by Twitch.
 *
 * Can be accessed using `client.unsupported` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const events = await api.unsupported.getChatters('yourfavoritestreamer');
 * ```
 *
 * @meta category misc
 * @meta categorizedTitle Unsupported APIs
 */
@rtfm('api', 'UnsupportedApi')
export class UnsupportedApi extends BaseApi {
	/**
	 * Retrieves a list of chatters in the Twitch chat of the given channel.
	 *
	 * **WARNING:** In contrast to most other methods, this takes a channel *name*, not a user ID.
	 *
	 * @param channel The channel to retrieve the chatters for.
	 */
	async getChatters(channel: UserNameResolvable): Promise<ChattersList> {
		const channelName = extractUserName(channel);

		const data: ChattersListData = await this._client.callApi({
			url: `https://tmi.twitch.tv/group/user/${channelName}/chatters`,
			type: 'custom'
		});
		return new ChattersList(data);
	}
}
