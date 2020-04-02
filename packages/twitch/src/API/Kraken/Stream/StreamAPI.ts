import { Cacheable, Cached } from '@d-fischer/cache-decorators';
import { extractUserId, UserIdResolvable } from '../../../Toolkit/UserTools';
import BaseAPI from '../../BaseAPI';
import Stream, { StreamData, StreamDataWrapper, StreamType } from './Stream';

/**
 * The API methods that deal with streams.
 *
 * Can be accessed using `client.kraken.streams` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = TwitchClient.withCredentials(clientId, accessToken);
 * const stream = await client.kraken.streams.getStreamByChannel('125328655');
 * ```
 */
@Cacheable
export default class StreamAPI extends BaseAPI {
	/**
	 * Retrieves the current stream on the given channel.
	 *
	 * @param channel
	 */
	@Cached(60)
	async getStreamByChannel(channel: UserIdResolvable) {
		const channelId = extractUserId(channel);
		const data = await this._client.callAPI<StreamDataWrapper>({ url: `streams/${channelId}` });

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
	) {
		const query: Record<string, string> = { limit: limit.toString() };

		if (channels) {
			query.channel = typeof channels === 'string' ? channels : channels.join(',');
		}

		if (game) {
			query.game = game;
		}

		if (languageCode) {
			query.language = languageCode;
		}

		if (type) {
			query.stream_type = type;
		}

		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		const data = await this._client.callAPI<{ streams: StreamData[] }>({ url: 'streams', query });

		return data.streams.map(streamData => new Stream(streamData, this._client));
	}

	/**
	 * Retrieves a list of all streams.
	 *
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 */
	async getAllStreams(page?: number, limit?: number) {
		return this.getStreams(undefined, undefined, undefined, StreamType.All, page, limit);
	}

	/**
	 * Retrieves a list of all live streams.
	 *
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 */
	async getAllLiveStreams(page?: number, limit?: number) {
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
	async getFollowedStreams(type?: StreamType, page?: number, limit: number = 25) {
		const query: Record<string, string> = { limit: limit.toString() };

		if (type) {
			query.type = type;
		}

		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		const data = await this._client.callAPI<{ streams: StreamData[] }>({
			url: 'streams/followed',
			query,
			scope: 'user_read'
		});

		return data.streams.map(streamData => new Stream(streamData, this._client));
	}
}
