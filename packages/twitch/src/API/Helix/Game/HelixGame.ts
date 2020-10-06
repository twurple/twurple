import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '../../../ApiClient';

export interface HelixGameData {
	id: string;
	name: string;
	box_art_url: string;
}

/**
 * A game as displayed on Twitch.
 */
export class HelixGame {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: HelixGameData, client: ApiClient) {
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
