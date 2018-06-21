import { NonEnumerable } from '../../../Toolkit/Decorators';
import HelixUser from '../User/HelixUser';
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
	 * Retrieves the user broadcasting the stream.
	 */
	async getUser(): Promise<HelixUser> {
		return this._client.helix.users.getUserById(this._data.user_id);
	}

	// TODO implement stream -> game
	// async getGame() {
	// }

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
	 * The type of the stream.
	 */
	get type() {
		return this._data.type;
	}
}
