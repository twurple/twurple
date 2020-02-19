import { Cacheable, Cached } from '@d-fischer/cache-decorators';
import { extractUserId, extractUserName, UserIdResolvable, UserNameResolvable } from '../../Toolkit/UserTools';
import { TwitchAPICallType } from '../../TwitchClient';
import BaseAPI from '../BaseAPI';
import ChannelEvent, { ChannelEventAPIResult, ChannelEventData } from './ChannelEvent';
import ChattersList, { ChattersListData } from './ChattersList';

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
export default class UnsupportedAPI extends BaseAPI {
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

	/**
	 * Retrieves a list of event planned for the given channel.
	 *
	 * @param channel The channel to retrieve the events for.
	 */
	@Cached(60)
	async getEvents(channel: UserIdResolvable) {
		const channelId = extractUserId(channel);
		const data = await this._client.callAPI<ChannelEventAPIResult>({ url: `channels/${channelId}/events` });
		return data.events.map((event: ChannelEventData) => new ChannelEvent(event, this._client));
	}
}
