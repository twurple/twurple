import { Cacheable, Cached } from '@d-fischer/cache-decorators';
import { BaseApi } from '../../BaseApi';
import type { ChannelData } from '../Channel/Channel';
import { Channel } from '../Channel/Channel';
import type { StreamData } from '../Stream/Stream';
import { Stream } from '../Stream/Stream';

/**
 * The API methods that deal with searching.
 *
 * Can be accessed using `client.kraken.search` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const client = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const channel = await client.kraken.search.searchStreams('Hearthstone');
 * ```
 */
@Cacheable
export class SearchApi extends BaseApi {
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

		const data = await this._client.callApi<{ channels: ChannelData[] }>({ url: 'search/channels', query });

		return data.channels.map(channelData => new Channel(channelData, this._client));
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

		const data = await this._client.callApi<{ streams: StreamData[] }>({ url: 'search/streams', query });

		return data.streams.map((streamData: StreamData) => new Stream(streamData, this._client));
	}
}
