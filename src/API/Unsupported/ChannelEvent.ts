import Channel, { ChannelData } from '../Channel/Channel';
import { NonEnumerable } from '../../Toolkit/Decorators';
import TwitchClient from '../../TwitchClient';

/** @private */
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

/** @private */
export interface ChannelEventAPIResult {
	_total: number;
	events: ChannelEventData[];
}

/**
 * An event held on a Twitch channel.
 */
export default class ChannelEvent {
	@NonEnumerable private readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: ChannelEventData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The channel where the event is held.
	 */
	get channel() {
		return new Channel(this._data.channel, this._client);
	}

	/**
	 * The ID of the event.
	 */
	get id() {
		return this._data._id;
	}

	/**
	 * The time when the event starts.
	 */
	get startTime() {
		return new Date(this._data.start_time);
	}

	/**
	 * The time when the event ends.
	 */
	get endTime() {
		return new Date(this._data.end_time);
	}

	/**
	 * The title of the event.
	 */
	get title() {
		return this._data.title;
	}

	/**
	 * The description of the event.
	 */
	get description() {
		return this._data.description;
	}

	/**
	 * Generates a URL to the cover image of the event with the given dimensions.
	 * @param width The width of the image.
	 * @param height The height of the image.
	 */
	buildCoverImageUrl(width: number, height: number) {
		return this._data.cover_image_url
			.replace('{width}', width.toString())
			.replace('{height}', height.toString());
	}
}
