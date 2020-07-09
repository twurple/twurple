import { Cacheable, Cached } from '@d-fischer/cache-decorators';
import { extractUserName, UserNameResolvable } from '../../Toolkit/UserTools';
import { TwitchAPICallType } from '../../TwitchClient';
import { BaseAPI } from '../BaseAPI';
import { ChattersList, ChattersListData } from './ChattersList';

/**
 * Different API methods that are not officially supported by Twitch.
 *
 * Can be accessed using `client.unsupported` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = TwitchClient.withCredentials(clientId, accessToken);
 * const events = await client.unsupported.getEvents('125328655');
 * ```
 */
@Cacheable
export class UnsupportedAPI extends BaseAPI {
	/**
	 * Retrieves a list of chatters in the Twitch chat of the given channel.
	 *
	 * **WARNING**: In contrast to most other methods, this takes a channel *name*, not a user ID.
	 *
	 * @param channel The channel to retrieve the chatters for.
	 */
	@Cached(60)
	async getChatters(channel: UserNameResolvable) {
		const channelName = extractUserName(channel);

		const data: ChattersListData = await this._client.callAPI({
			url: `https://tmi.twitch.tv/group/user/${channelName}/chatters`,
			type: TwitchAPICallType.Custom
		});
		return new ChattersList(data);
	}
}
