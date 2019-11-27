import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from '../../TwitchClient';
import Channel, { ChannelData } from '../Kraken/Channel/Channel';

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
	 * The ID of the event.
	 */
	get id() {
		return this._data._id;
	}

	/**
	 * The time when the event starts.
	 */
	get startDate() {
		return new Date(this._data.start_time);
	}

	/**
	 * The time when the event ends.
	 */
	get endDate() {
		return new Date(this._data.end_time);
	}

	/**
	 * The ID of the timezone that the start and end times of the event are local to.
	 */
	get timeZoneId() {
		return this._data.time_zone_id;
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
	 * The language of the event.
	 */
	get language() {
		return this._data.language;
	}

	/**
	 * The channel where the event is held.
	 */
	get channel() {
		return new Channel(this._data.channel, this._client);
	}

	/**
	 * Generates a URL to the cover image of the event with the given dimensions.
	 *
	 * @param width The width of the image.
	 * @param height The height of the image.
	 */
	buildCoverImageUrl(width: number, height: number) {
		return this._data.cover_image_url.replace('{width}', width.toString()).replace('{height}', height.toString());
	}
}
