import { Cacheable, Cached } from '@d-fischer/cache-decorators';
import type { UserIdResolvable } from '../../../Toolkit/UserTools';
import { extractUserId } from '../../../Toolkit/UserTools';
import { BaseApi } from '../../BaseApi';
import type { StreamData, StreamDataWrapper } from './Stream';
import { Stream, StreamType } from './Stream';

/**
 * The API methods that deal with streams.
 *
 * Can be accessed using `client.kraken.streams` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const stream = await api.kraken.streams.getStreamByChannel('125328655');
 * ```
 */
@Cacheable
export class StreamApi extends BaseApi {
	/**
	 * Retrieves the current stream on the given channel.
	 *
	 * @param channel
	 */
	@Cached(60)
	async getStreamByChannel(channel: UserIdResolvable): Promise<Stream | null> {
		const channelId = extractUserId(channel);
		const data = await this._client.callApi<StreamDataWrapper>({ url: `streams/${channelId}` });

		return data.stream ? new Stream(data.stream, this._client) : null;
	}

	/**
	 * Retrieves a list of streams.
	 *
	 * @param channels A channel ID or a list thereof.
	 * @param game Show only streams playing a certain game.
	 * @param languageCode Show only streams in a certain language.
	 * @param type Show only streams of a certain type.
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 */
	async getStreams(
		channels?: string | string[],
		game?: string,
		languageCode?: string,
		type?: StreamType,
		page?: number,
		limit: number = 25
	): Promise<Stream[]> {
		const query: Record<string, string | undefined> = {
			limit: limit.toString(),
			channel: typeof channels === 'string' ? channels : channels?.join(','),
			game,
			language: languageCode,
			stream_type: type,
			offset: page ? ((page - 1) * limit).toString() : undefined
		};

		const data = await this._client.callApi<{ streams: StreamData[] }>({ url: 'streams', query });

		return data.streams.map(streamData => new Stream(streamData, this._client));
	}

	/**
	 * Retrieves a list of all streams.
	 *
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 */
	async getAllStreams(page?: number, limit?: number): Promise<Stream[]> {
		return this.getStreams(undefined, undefined, undefined, StreamType.All, page, limit);
	}

	/**
	 * Retrieves a list of all live streams.
	 *
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 */
	async getAllLiveStreams(page?: number, limit?: number): Promise<Stream[]> {
		return this.getStreams(undefined, undefined, undefined, StreamType.Live, page, limit);
	}

	/**
	 * Retrieves a list of all streams on channels the currently authenticated user is following.
	 *
	 * @param type Show only streams of a certain type.
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 */
	@Cached(60)
	async getFollowedStreams(type?: StreamType, page?: number, limit: number = 25): Promise<Stream[]> {
		const query: Record<string, string> = { limit: limit.toString() };

		if (type) {
			query.type = type;
		}

		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		const data = await this._client.callApi<{ streams: StreamData[] }>({
			url: 'streams/followed',
			query,
			scope: 'user_read'
		});

		return data.streams.map(streamData => new Stream(streamData, this._client));
	}
}
