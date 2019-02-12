import BaseAPI from '../../BaseAPI';
import HelixStream, { HelixStreamData, HelixStreamType } from './HelixStream';
import { TwitchAPICallType } from '../../../TwitchClient';
import HelixPaginatedRequest from '../HelixPaginatedRequest';
import UserTools, { UserIdResolvable } from '../../../Toolkit/UserTools';
import HelixStreamMarkerWithVideo, { HelixStreamMarkerVideoData } from './HelixStreamMarkerWithVideo';
import HelixResponse from '../HelixResponse';
import HelixStreamMarker, { HelixStreamMarkerData } from './HelixStreamMarker';
import StreamNotLiveError from '../../../Errors/StreamNotLiveError';
import HTTPStatusCodeError from '../../../Errors/HTTPStatusCodeError';

/**
 * Filters for the streams request.
 */
export interface HelixStreamFilter {
	/**
	 * A community ID or a list thereof.
	 */
	community?: string | string[];

	/**
	 * A game ID or a list thereof.
	 */
	game?: string | string[];

	/**
	 * A language or a list thereof.
	 */
	language?: string | string[];

	/**
	 * A type of stream.
	 */
	type?: HelixStreamType;

	/**
	 * A user ID or a list thereof.
	 */
	userId?: string | string[];

	/**
	 * A user name or a list thereof.
	 */
	userName?: string | string[];
}

/** @private */
interface HelixStreamGetMarkersResultVideo {
	video_id: string;
	markers: HelixStreamMarkerVideoData[];
}

/** @private */
interface HelixStreamGetMarkersResult {
	user_id: string;
	user_name: string;
	videos: HelixStreamGetMarkersResultVideo[];
}

/**
 * The Helix API methods that deal with streams.
 *
 * Can be accessed using `client.helix.streams` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = new TwitchClient(options);
 * const stream = await client.helix.streams.getStreamByUserId('125328655');
 * ```
 */
export default class HelixStreamAPI extends BaseAPI {
	/**
	 * Retrieves a list of streams.
	 *
	 * @expandParams
	 */
	getStreams(filter: HelixStreamFilter = {}) {
		return new HelixPaginatedRequest(
			{
				url: 'streams',
				type: TwitchAPICallType.Helix,
				query: {
					community_id: filter.community,
					game_id: filter.game,
					language: filter.language,
					type: filter.type,
					user_id: filter.userId,
					user_login: filter.userName
				}
			},
			this._client,
			(data: HelixStreamData) => new HelixStream(data, this._client)
		);
	}

	/**
	 * Retrieves the current stream for the given user name.
	 *
	 * @param userName The user name to retrieve the stream for.
	 */
	async getStreamByUserName(userName: string) {
		const req = this.getStreams({ userName });
		const streams = await req.getAll();

		return streams.length ? streams[0] : null;
	}

	/**
	 * Retrieves the current stream for the given user ID.
	 *
	 * @param user The user ID to retrieve the stream for.
	 */
	async getStreamByUserId(user: UserIdResolvable) {
		const req = this.getStreams({ userId: UserTools.getUserId(user) });
		const streams = await req.getAll();

		return streams.length ? streams[0] : null;
	}

	private _getStreamMarkers(queryType: string, id: string) {
		return new HelixPaginatedRequest(
			{
				url: 'streams/markers',
				type: TwitchAPICallType.Helix,
				query: {
					[queryType]: id
				},
				scope: 'user:read:broadcast'
			},
			this._client,
			(data: HelixStreamGetMarkersResult) => data.videos.reduce(
				(result, video) => [...result, ...video.markers.map(
					marker => new HelixStreamMarkerWithVideo(marker, video.video_id, this._client)
				)],
				[]
			)
		);
	}

	/**
	 * Retrieves a list of all stream markers for an user.
	 *
	 * @param user The user to list the stream markers for.
	 */
	getStreamMarkersForUser(user: UserIdResolvable) {
		return this._getStreamMarkers('user_id', UserTools.getUserId(user));
	}

	/**
	 * Retrieves a list of all stream markers for a video.
	 *
	 * @param videoId The video to list the stream markers for.
	 */
	getStreamMarkersForVideo(videoId: string) {
		return this._getStreamMarkers('video_id', videoId);
	}

	/**
	 * Creates a new stream marker.
	 *
	 * Only works while your stream is live.
	 */
	async createStreamMarker() {
		try {
			const data = await this._client.callAPI<HelixResponse<HelixStreamMarkerData>>({
				url: 'streams/markers',
				method: 'POST',
				type: TwitchAPICallType.Helix,
				scope: 'user:edit:broadcast'
			});

			return new HelixStreamMarker(data.data[0], this._client);
		} catch (e) {
			if ((e instanceof HTTPStatusCodeError) && e.statusCode === 404) {
				throw new StreamNotLiveError();
			}

			throw e;
		}
	}
}
