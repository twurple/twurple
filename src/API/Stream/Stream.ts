import { NonEnumerable } from '../../Toolkit/Decorators';
import Channel, { ChannelData } from '../Channel/Channel';
import TwitchClient from '../../TwitchClient';

export interface StreamPreviewUrlList {
	small: string;
	medium: string;
	large: string;
	template: string;
}

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

export type StreamType = 'live' | 'watch_party' | 'all';

export default class Stream {
	@NonEnumerable private readonly _client: TwitchClient;

	constructor(private readonly _data: StreamData, client: TwitchClient) {
		this._client = client;
	}

	get channel() {
		return new Channel(this._data.channel, this._client);
	}

	get game() {
		return this._data.game;
	}

	get viewers() {
		return this._data.viewers;
	}

	get startDate() {
		return new Date(this._data.created_at);
	}

	get type() {
		return this._data.stream_type;
	}
}
