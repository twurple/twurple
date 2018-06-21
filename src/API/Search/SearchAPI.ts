import { Cacheable, Cached } from '../../Toolkit/Decorators';
import BaseAPI from '../BaseAPI';
import { UniformObject } from '../../Toolkit/ObjectTools';
import Channel, { ChannelData } from '../Channel/Channel';
import Stream, { StreamData } from '../Stream/Stream';

@Cacheable
export default class SearchAPI extends BaseAPI {
	@Cached(300)
	async searchChannels(term: string, page?: number, limit: number = 25): Promise<Channel[]> {
		const query: UniformObject<string> = { query: term, limit: limit.toString() };

		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		const data = await this._client.apiCall({ url: 'search/channels', query });

		return data.channels.map((channelData: ChannelData) => new Channel(channelData, this._client));
	}

	@Cached(300)
	async searchStreams(term: string, page?: number, limit: number = 25, hls?: boolean): Promise<Stream[]> {
		const query: UniformObject<string> = { query: term, limit: limit.toString() };

		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		if (hls !== undefined) {
			query.hls = hls.toString();
		}

		const data = await this._client.apiCall({ url: 'search/streams', query });

		return data.streams.map((streamData: StreamData) => new Stream(streamData, this._client));
	}
}
