import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '../../../ApiClient';
import type { ChannelData } from '../Channel/Channel';
import { Channel } from '../Channel/Channel';

/**
 * The possible sizes for a stream preview.
 */
export type StreamPreviewSize = 'small' | 'medium' | 'large' | 'template';

/** @private */
export type StreamPreviewUrlList = {
	[size in StreamPreviewSize]: string;
};

/** @private */
export interface StreamDataWrapper {
	stream: StreamData;
}

/** @private */
export interface StreamDataWrapper {
	stream: StreamData;
}

/** @private */
export interface StreamData {
	_id: string | number;
	game: string;
	viewers: number;
	video_height: number;
	average_fps: number;
	delay: number;
	created_at: string;
	is_playlist: boolean;
	stream_type: StreamType;
	preview: StreamPreviewUrlList;
	channel: ChannelData;
}

/**
 * The type of a stream.
 */
export enum StreamType {
	/**
	 * A live stream.
	 */
	Live = 'live',

	/**
	 * An upload to the channel (VoD) that is streamed live for the first time.
	 */
	Premiere = 'premiere',

	/**
	 * A rerun of a past live stream.
	 */
	ReRun = 'rerun',

	/**
	 * All types of streams. Used for filtering.
	 */
	All = 'all'
}

/**
 * A Twitch stream.
 */
export class Stream {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: StreamData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the stream.
	 */
	get id(): string {
		return this._data._id.toString();
	}

	/**
	 * The game played on the stream.
	 */
	get game(): string {
		return this._data.game;
	}

	/**
	 * The current number of concurrent viewers.
	 */
	get viewers(): number {
		return this._data.viewers;
	}

	/**
	 * The height of the stream video.
	 */
	get videoHeight(): number {
		return this._data.video_height;
	}

	/**
	 * The average FPS (frames per second) that are shown on the stream.
	 */
	get averageFps(): number {
		return this._data.average_fps;
	}

	/** @deprecated Use averageFps instead. */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	get averageFPS(): number {
		return this._data.average_fps;
	}

	/**
	 * The delay of the stream, in seconds.
	 */
	get delay(): number {
		return this._data.delay;
	}

	/**
	 * The time when the stream started.
	 */
	get startDate(): Date {
		return new Date(this._data.created_at);
	}

	/**
	 * Whether the stream is running a playlist.
	 */
	get isPlaylist(): boolean {
		return this._data.is_playlist;
	}

	/**
	 * The type of the stream.
	 */
	get type(): StreamType {
		return this._data.stream_type;
	}

	/**
	 * Gets the URL of a preview image for the stream
	 *
	 * @param size The size of the image.
	 */
	getPreviewUrl(size: StreamPreviewSize): string {
		return this._data.preview[size];
	}

	/**
	 * The channel where the stream is shown.
	 */
	get channel(): Channel {
		return new Channel(this._data.channel, this._client);
	}
}
