import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from '../../../TwitchClient';

export interface HelixGameData {
	id: string;
	name: string;
	box_art_url: string;
}

/**
 * A game as displayed on Twitch.
 */
export default class HelixGame {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: HelixGameData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The ID of the game.
	 */
	get id() {
		return this._data.id;
	}

	/**
	 * The name of the game.
	 */
	get name() {
		return this._data.name;
	}

	/**
	 * The URL of the box art of the game.
	 */
	get boxArtUrl() {
		return this._data.box_art_url;
	}
}
