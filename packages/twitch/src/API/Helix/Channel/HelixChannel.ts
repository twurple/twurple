import { Enumerable } from '@d-fischer/shared-utils';
import type { HelixGame } from '../Game/HelixGame';
import type { ApiClient } from '../../../ApiClient';

/** @private */
export interface HelixChannelData {
	broadcaster_id: string;
	broadcaster_name: string;
	broadcaster_language: string;
	game_id: string;
	game_name: string;
	title: string;
}

/**
 * A Twitch channel.
 */
export class HelixChannel {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(/** @private */ protected _data: HelixChannelData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the channel.
	 */
	get id(): string {
		return this._data.broadcaster_id;
	}

	/**
	 * The display name of the channel.
	 */
	get displayName(): string {
		return this._data.broadcaster_name;
	}

	/**
	 * The language of the channel.
	 */
	get language(): string {
		return this._data.broadcaster_language;
	}

	/**
	 * The ID of the game currently played on the channel.
	 */
	get gameId(): string {
		return this._data.game_id;
	}

	/**
	 * The name of the game currently played on the channel.
	 */
	get gameName(): string {
		return this._data.game_name;
	}

	/**
	 * Retrieves information about the game that is being played on this stream.
	 */
	async getGame(): Promise<HelixGame | null> {
		return this._client.helix.games.getGameById(this._data.game_id);
	}

	/**
	 * The title of the channel.
	 */
	get title(): string {
		return this._data.title;
	}
}
