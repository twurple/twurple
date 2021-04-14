import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { Channel } from '../Channel/Channel';

/** @private */
export interface VideoChannelData {
	_id: string;
	name: string;
	display_name: string;
}

/** @private */
export interface VideoMutedSegment {
	duration: number;
	offset: number;
}

/** @private */
export type VideoThumbSize = 'large' | 'medium' | 'small' | 'template';

/** @private */
export interface VideoThumbnail {
	type: string;
	url: string;
}

/** @private */
export type VideoViewability = 'public' | 'private';

/** @private */
export interface VideoData {
	_id: string;
	broadcast_id: string;
	broadcast_type: string;
	channel: VideoChannelData;
	created_at: string;
	description: string;
	description_html: string;
	fps: Record<string, number>;
	game: string;
	language: string;
	length: number;
	muted_segments: VideoMutedSegment[];
	preview: Record<VideoThumbSize, string>;
	published_at: string;
	resolutions: Record<string, string>;
	status: string;
	tag_list: string;
	thumbnails: Record<VideoThumbSize, VideoThumbnail[]>;
	title: string;
	url: string;
	viewable: VideoViewability;
	viewable_at: string | null;
	views: number;
}

/**
 * A Twitch video.
 */
@rtfm<Video>('twitch', 'Video', 'id')
export class Video {
	/** @private */
	@Enumerable(false) private readonly _data: VideoData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: VideoData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the video.
	 */
	get id(): string {
		return this._data._id;
	}

	/**
	 * The ID of the channel the video was uploaded to.
	 */
	get channelId(): string {
		return this._data.channel._id;
	}

	/**
	 * The name of the channel the video was uploaded to.
	 */
	get channelName(): string {
		return this._data.channel.name;
	}

	/**
	 * The display name of the channel the video was uploaded to.
	 */
	get channelDisplayName(): string {
		return this._data.channel.display_name;
	}

	/**
	 * Retrieves more information about the channel the video was uploaded to.
	 */
	async getChannel(): Promise<Channel> {
		return this._client.kraken.channels.getChannel(this._data.channel._id);
	}

	/**
	 * The date when the video was created.
	 */
	get creationDate(): Date {
		return new Date(this._data.created_at);
	}

	/**
	 * The description of the video.
	 */
	get description(): string {
		return this._data.description;
	}

	/**
	 * The description of the video in HTML.
	 */
	get htmlDescription(): string {
		return this._data.description_html;
	}

	/**
	 * The resolutions the video is available in.
	 */
	get resolutions(): Record<string, string> {
		return this._data.resolutions;
	}

	/**
	 * Gets the FPS (frames per second) of the video for a given resolution.
	 *
	 * @param resolution The resolution to get FPS for. This is the *key* of the resolutions object.
	 */
	getFps(resolution: string): number | undefined {
		return this._data.fps[resolution];
	}

	/**
	 * The name of the game shown in the video.
	 */
	get gameName(): string {
		return this._data.game;
	}

	/**
	 * The language of the video.
	 */
	get language(): string {
		return this._data.language;
	}

	/**
	 * The length of the video, in seconds.
	 */
	get length(): number {
		return this._data.length;
	}

	/**
	 * The muted segments of the video.
	 */
	get mutedSegments(): VideoMutedSegment[] {
		return this._data.muted_segments;
	}

	/**
	 * Gets the URL for a given size of the video.
	 *
	 * @param size The size of the preview.
	 */
	getPreview(size: VideoThumbSize): string {
		return this._data.preview[size];
	}

	/**
	 * The date when the video was published.
	 */
	get publishDate(): Date {
		return new Date(this._data.published_at);
	}

	/**
	 * The status of the video.
	 */
	get status(): string {
		return this._data.status;
	}

	/**
	 * A list of tags of the video.
	 */
	get tags(): string[] {
		return this._data.tag_list.split(',');
	}

	/**
	 * Gets a list of thumbnails for a given size of the video.
	 *
	 * @param size
	 */
	getThumbnails(size: VideoThumbSize): VideoThumbnail[] {
		return this._data.thumbnails[size];
	}

	/**
	 * The title of the video.
	 */
	get title(): string {
		return this._data.title;
	}

	/**
	 * The URL of the video.
	 */
	get url(): string {
		return this._data.url;
	}

	/**
	 * Whether the video is public.
	 */
	get isPublic(): boolean {
		return this._data.viewable === 'public';
	}

	/**
	 * The time when the video will be viewable publicly.
	 */
	get viewabilityDate(): Date | null {
		return this._data.viewable_at ? new Date(this._data.viewable_at) : null;
	}

	/**
	 * The number of views of the video.
	 */
	get views(): number {
		return this._data.views;
	}
}
