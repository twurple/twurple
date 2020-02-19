import { Cacheable, Cached } from '@d-fischer/cache-decorators';
import BaseAPI from '../../BaseAPI';
import Channel, { ChannelData } from '../Channel/Channel';
import Stream, { StreamData } from '../Stream/Stream';

/**
 * The API methods that deal with searching.
 *
 * Can be accessed using `client.kraken.search` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = TwitchClient.withCredentials(clientId, accessToken);
 * const channel = await client.kraken.search.searchStreams('Hearthstone');
 * ```
 */
@Cacheable
export default class SearchAPI extends BaseAPI {
	/**
	 * Retrieves a list of channels that match the given search term.
	 *
	 * @param term The term you want to search for.
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 */
	@Cached(300)
	async searchChannels(term: string, page?: number, limit: number = 25): Promise<Channel[]> {
		const query: Record<string, string> = { query: term, limit: limit.toString() };

		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		const data = await this._client.callAPI({ url: 'search/channels', query });

		return data.channels.map((channelData: ChannelData) => new Channel(channelData, this._client));
	}

	/**
	 * Retrieves a list of streams that match the given search term.
	 *
	 * @param term The term you want to search for.
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 * @param hls Whether you want only HLS or only non-HLS (RTMP) streams. If not set, finds both types of streams.
	 */
	@Cached(300)
	async searchStreams(term: string, page?: number, limit: number = 25, hls?: boolean): Promise<Stream[]> {
		const query: Record<string, string> = { query: term, limit: limit.toString() };

		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		if (hls !== undefined) {
			query.hls = hls.toString();
		}

		const data = await this._client.callAPI({ url: 'search/streams', query });

		return data.streams.map((streamData: StreamData) => new Stream(streamData, this._client));
	}
}
