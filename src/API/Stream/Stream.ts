import { NonEnumerable } from '../../Toolkit/Decorators';
import Channel, { ChannelData } from '../Channel/Channel';
import TwitchClient from '../../TwitchClient';

/** @private */
export interface StreamPreviewUrlList {
	small: string;
	medium: string;
	large: string;
	template: string;
}

/** @private */
export interface StreamData {
	_id: string;
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
export default class Stream {
	@NonEnumerable private readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: StreamData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The channel where the stream is shown.
	 */
	get channel() {
		return new Channel(this._data.channel, this._client);
	}

	/**
	 * The game played on the stream.
	 */
	get game() {
		return this._data.game;
	}

	/**
	 * The current number of concurrent viewers.
	 */
	get viewers() {
		return this._data.viewers;
	}

	/**
	 * The time when the stream started.
	 */
	get startDate() {
		return new Date(this._data.created_at);
	}

	/**
	 * The type of the stream.
	 */
	get type() {
		return this._data.stream_type;
	}
}
