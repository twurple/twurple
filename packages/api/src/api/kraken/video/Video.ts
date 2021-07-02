import { Enumerable, mapNullable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { Channel } from '../channel/Channel';

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
@rtfm<Video>('api', 'Video', 'id')
export class Video extends DataObject<VideoData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: VideoData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the video.
	 */
	get id(): string {
		return this[rawDataSymbol]._id;
	}

	/**
	 * The ID of the channel the video was uploaded to.
	 */
	get channelId(): string {
		return this[rawDataSymbol].channel._id;
	}

	/**
	 * The name of the channel the video was uploaded to.
	 */
	get channelName(): string {
		return this[rawDataSymbol].channel.name;
	}

	/**
	 * The display name of the channel the video was uploaded to.
	 */
	get channelDisplayName(): string {
		return this[rawDataSymbol].channel.display_name;
	}

	/**
	 * Retrieves more information about the channel the video was uploaded to.
	 */
	async getChannel(): Promise<Channel> {
		return await this._client.kraken.channels.getChannel(this[rawDataSymbol].channel._id);
	}

	/**
	 * The date when the video was created.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * The description of the video.
	 */
	get description(): string {
		return this[rawDataSymbol].description;
	}

	/**
	 * The description of the video in HTML.
	 */
	get htmlDescription(): string {
		return this[rawDataSymbol].description_html;
	}

	/**
	 * The resolutions the video is available in.
	 */
	get resolutions(): Record<string, string> {
		return this[rawDataSymbol].resolutions;
	}

	/**
	 * Gets the FPS (frames per second) of the video for a given resolution.
	 *
	 * @param resolution The resolution to get FPS for. This is the *key* of the resolutions object.
	 */
	getFps(resolution: string): number | undefined {
		return this[rawDataSymbol].fps[resolution];
	}

	/**
	 * The name of the game shown in the video.
	 */
	get gameName(): string {
		return this[rawDataSymbol].game;
	}

	/**
	 * The language of the video.
	 */
	get language(): string {
		return this[rawDataSymbol].language;
	}

	/**
	 * The length of the video, in seconds.
	 */
	get length(): number {
		return this[rawDataSymbol].length;
	}

	/**
	 * The muted segments of the video.
	 */
	get mutedSegments(): VideoMutedSegment[] {
		return this[rawDataSymbol].muted_segments;
	}

	/**
	 * Gets the URL for a given size of the video.
	 *
	 * @param size The size of the preview.
	 */
	getPreview(size: VideoThumbSize): string {
		return this[rawDataSymbol].preview[size];
	}

	/**
	 * The date when the video was published.
	 */
	get publishDate(): Date {
		return new Date(this[rawDataSymbol].published_at);
	}

	/**
	 * The status of the video.
	 */
	get status(): string {
		return this[rawDataSymbol].status;
	}

	/**
	 * A list of tags of the video.
	 */
	get tags(): string[] {
		return this[rawDataSymbol].tag_list.split(',');
	}

	/**
	 * Gets a list of thumbnails for a given size of the video.
	 *
	 * @param size
	 */
	getThumbnails(size: VideoThumbSize): VideoThumbnail[] {
		return this[rawDataSymbol].thumbnails[size];
	}

	/**
	 * The title of the video.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The URL of the video.
	 */
	get url(): string {
		return this[rawDataSymbol].url;
	}

	/**
	 * Whether the video is public.
	 */
	get isPublic(): boolean {
		return this[rawDataSymbol].viewable === 'public';
	}

	/**
	 * The time when the video will be viewable publicly.
	 */
	get viewabilityDate(): Date | null {
		return mapNullable(this[rawDataSymbol].viewable_at, v => new Date(v));
	}

	/**
	 * The number of views of the video.
	 */
	get views(): number {
		return this[rawDataSymbol].views;
	}
}
