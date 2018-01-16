import Channel, { ChannelData } from '../Channel/';
import Twitch from '../../';
import { NonEnumerable } from '../../Toolkit/Decorators';

export interface ChannelEventData {
	_id: string;
	start_time: string;
	end_time: string;
	time_zone_id: string;
	title: string;
	description: string;
	cover_image_url: string;
	language: string;
	channel: ChannelData;
	// game: GameData;
}

export interface ChannelEventAPIResult {
	_total: number;
	events: ChannelEventData[];
}

export default class ChannelEvent {
	@NonEnumerable _client: Twitch;

	constructor(private readonly _data: ChannelEventData, client: Twitch) {
		this._client = client;
	}

	get channel() {
		return new Channel(this._data.channel, this._client);
	}

	get id() {
		return this._data._id;
	}

	get startTime() {
		return new Date(this._data.start_time);
	}

	get endTime() {
		return new Date(this._data.end_time);
	}

	get title() {
		return this._data.title;
	}

	get description() {
		return this._data.description;
	}

	buildCoverImageUrl(width: number, height: number) {
		return this._data.cover_image_url
			.replace('{width}', width.toString())
			.replace('{height}', height.toString());
	}
}
