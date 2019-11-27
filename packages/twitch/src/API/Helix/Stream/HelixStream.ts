import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from '../../../TwitchClient';

/**
 * The type of a stream.
 */
export enum HelixStreamType {
	/**
	 * Returned by Twitch in case of an error.
	 */
	None = '',

	/**
	 * A live stream.
	 */
	Live = 'live',

	/**
	 * A vodcast.
	 *
	 * Currently not supported by Twitch - but one can only hope and leave it in here.
	 */
	Vodcast = 'vodcast'
}

/** @private */
export interface HelixStreamData {
	id: string;
	user_id: string;
	user_name: string;
	game_id: string;
	community_ids: string[];
	type: HelixStreamType;
	title: string;
	viewer_count: number;
	started_at: string;
	language: string;
	thumbnail_url: string;
}

/**
 * A Twitch stream.
 */
export default class HelixStream {
	@NonEnumerable private readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: HelixStreamData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The stream ID.
	 */
	get id() {
		return this._data.id;
	}

	/**
	 * The user ID.
	 */
	get userId() {
		return this._data.user_id;
	}

	/**
	 * The user's display name.
	 */
	get userDisplayName() {
		return this._data.user_name;
	}

	/**
	 * Retrieves information about the user broadcasting the stream.
	 */
	async getUser() {
		return this._client.helix.users.getUserById(this._data.user_id);
	}

	/**
	 * The game ID.
	 */
	get gameId() {
		return this._data.game_id;
	}

	/**
	 * Retrieves information about the game that is being played on this stream.
	 */
	async getGame() {
		return this._client.helix.games.getGameById(this._data.game_id);
	}

	/**
	 * The type of the stream.
	 */
	get type() {
		return this._data.type;
	}

	/**
	 * The title of the stream.
	 */
	get title() {
		return this._data.title;
	}

	/**
	 * The number of viewers the stream currently has.
	 */
	get viewers() {
		return this._data.viewer_count;
	}

	/**
	 * The time when the stream started.
	 */
	get startDate() {
		return new Date(this._data.started_at);
	}

	/**
	 * The language of the stream.
	 */
	get language() {
		return this._data.language;
	}

	/**
	 * The URL of the thumbnail of the stream.
	 */
	get thumbnailUrl() {
		return this._data.thumbnail_url;
	}
}
