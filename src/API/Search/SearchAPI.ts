import { Cacheable, Cached } from '../../Toolkit/Decorators';
import BaseAPI from '../BaseAPI';
import { UniformObject } from '../../Toolkit/ObjectTools';
import Channel, { ChannelData } from '../Channel/';
import Stream, { StreamData } from '../Stream/';

@Cacheable
export default class SearchAPI extends BaseAPI {
	@Cached(300)
	async searchChannels(term: string, page?: number, limit?: number): Promise<Channel[]> {
		const query: UniformObject<string> = {query: term};

		if (page) {
			query.offset = ((page - 1) * (limit || 10)).toString();
		}
		if (limit) {
			query.limit = limit.toString();
		}

		const data = await this._client.apiCall({url: 'search/channels', query});

		return data.channels.map((channelData: ChannelData) => new Channel(channelData, this._client));
	}

	@Cached(300)
	async searchStreams(term: string, page?: number, limit?: number, hls?: boolean): Promise<Stream[]> {
		const query: UniformObject<string> = {query: term};

		if (page) {
			query.offset = ((page - 1) * (limit || 10)).toString();
		}
		if (limit) {
			query.limit = limit.toString();
		}
		if (hls !== undefined) {
			query.hls = hls.toString();
		}

		const data = await this._client.apiCall({url: 'search/streams', query});

		return data.streams.map((streamData: StreamData) => new Stream(streamData, this._client));
	}
}
