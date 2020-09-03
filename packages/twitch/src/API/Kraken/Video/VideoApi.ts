import { TwitchApiCallType } from 'twitch-api-call';
import { extractUserId, UserIdResolvable } from '../../..';
import { BaseApi } from '../../BaseApi';
import { CreatedVideo, CreatedVideoData } from './CreatedVideo';
import { Video, VideoData, VideoViewability } from './Video';

/**
 * Possible periods to search videos in.
 */
export type VideoSearchPeriod = 'week' | 'month' | 'all';

/**
 * Possible video types to search for.
 */
export type VideoType = 'archive' | 'highlight' | 'upload';

/**
 * Possible ways to sort videos.
 */
export type VideoSort = 'time' | 'views';

/** @private */
export interface VideoEditData {
	/**
	 * The new description of the video.
	 */
	description?: string;

	/**
	 * The new game of the video.
	 */
	game?: string;

	/**
	 * The new language of the video.
	 */
	language?: string;

	/**
	 * The new tag list of the video.
	 */
	tag_list?: string;
}

/**
 * Video data for a new video using {@VideoApi#createVideo}.
 */
interface VideoCreateData extends VideoEditData {
	/**
	 * The new title of the video.
	 */
	title: string;

	/**
	 * Whether the video will be public or private initially.
	 */
	viewable: VideoViewability;

	/**
	 * When the video will become public.
	 *
	 * This only takes effect if `viewable` is `private`.
	 */
	viewable_at: string;
}

/**
 * Video data to update using {@VideoApi#updateVideo}.
 *
 * @inheritDoc
 */
export interface VideoUpdateData extends VideoEditData {
	/**
	 * The new title of the video.
	 */
	title?: string;
}

/**
 * The API methods that deal with users.
 *
 * Can be accessed using `client.kraken.videos` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const client = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const user = await client.kraken.videos.getUser('125328655');
 * ```
 */
export class VideoApi extends BaseApi {
	/**
	 * Retrieves a video by ID.
	 *
	 * @param id The ID of the video.
	 */
	async getVideo(id: string) {
		const data = await this._client.callApi<VideoData>({ url: `videos/${id}` });
		return new Video(data, this._client);
	}

	/**
	 * Retrieves the top videos.
	 *
	 * @param game Show only videos of a certain game.
	 * @param searchPeriod Show only videos from a certain time period.
	 * @param type Show only videos of a certain type.
	 * @param languageCode Show only videos in a certain language.
	 * @param sort Sort the videos by specified criteria.
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 */
	async getTopVideos(
		game?: string,
		searchPeriod?: VideoSearchPeriod,
		type?: VideoType,
		languageCode?: string,
		sort?: VideoSort,
		page?: number,
		limit: number = 10
	) {
		const query: Record<string, string | undefined> = {
			limit: limit.toString(),
			game,
			period: searchPeriod,
			broadcast_type: type,
			language: languageCode,
			sort,
			offset: page ? ((page - 1) * limit).toString() : undefined
		};

		const data = await this._client.callApi<{ vods: VideoData[] }>({ url: 'videos/top', query });
		return data.vods.map(vod => new Video(vod, this._client));
	}

	/**
	 * Retrieves the videos from channels followed by the authenticated user.
	 *
	 * @param type Show only videos of a certain type.
	 * @param languageCode Show only videos in a certain language.
	 * @param sort Sort the videos by specified criteria.
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 */
	async getFollowedVideos(
		type?: VideoType,
		languageCode?: string,
		sort?: VideoSort,
		page?: number,
		limit: number = 10
	) {
		const query: Record<string, string | undefined> = {
			limit: limit.toString(),
			broadcast_type: type,
			language: languageCode,
			sort,
			offset: page ? ((page - 1) * limit).toString() : undefined
		};

		const data = await this._client.callApi<{ vods: VideoData[] }>({ url: 'videos/followed', query });
		return data.vods.map(vod => new Video(vod, this._client));
	}

	/**
	 * Creates a new video.
	 *
	 * @param channel The channel to upload the video to.
	 * @param createData The data for the video.
	 */
	async createVideo(channel: UserIdResolvable, createData: VideoCreateData) {
		const channelId = extractUserId(channel);
		const data = await this._client.callApi<CreatedVideoData>({
			url: 'videos',
			method: 'POST',
			scope: 'channel_editor',
			query: {
				channel_id: channelId,
				...createData
			}
		});
		return new CreatedVideo(data, this._client);
	}

	/**
	 * Completes a video upload.
	 *
	 * @param id The ID of the video.
	 * @param token The upload token.
	 */
	async completeVideoUpload(id: string, token: string) {
		await this._client.callApi({
			url: `https://uploads.twitch.tv/upload/${id}/complete`,
			type: TwitchApiCallType.Custom,
			method: 'POST',
			auth: false,
			query: {
				upload_token: token
			}
		});
	}

	/**
	 * Updates an already uploaded video.
	 *
	 * @param id The ID of the video.
	 * @param updateData The data to change for the video.
	 */
	async updateVideo(id: string, updateData: VideoUpdateData) {
		await this._client.callApi({
			url: `videos/${id}`,
			method: 'PUT',
			scope: 'channel_editor',
			jsonBody: updateData
		});
	}

	/**
	 * Deletes a video.
	 *
	 * @param id The ID of the video.
	 */
	async deleteVideo(id: string) {
		await this._client.callApi({
			url: `videos/${id}`,
			method: 'DELETE',
			scope: 'channel_editor'
		});
	}
}
