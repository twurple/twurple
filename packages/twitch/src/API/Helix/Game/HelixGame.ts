import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ApiClient } from '../../../ApiClient';

export interface HelixGameData {
	id: string;
	name: string;
	box_art_url: string;
}

/**
 * A game as displayed on Twitch.
 */
@rtfm<HelixGame>('twitch', 'HelixGame', 'id')
export class HelixGame {
	@Enumerable(false) private readonly _data: HelixGameData;
	/** @private */ @Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixGameData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the game.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The name of the game.
	 */
	get name(): string {
		return this._data.name;
	}

	/**
	 * The URL of the box art of the game.
	 */
	get boxArtUrl(): string {
		return this._data.box_art_url;
	}
}
