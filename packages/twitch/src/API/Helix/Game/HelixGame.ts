import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPagination } from '../HelixPagination';
import type { HelixPaginatedResponse } from '../HelixResponse';
import type { HelixStream, HelixStreamData } from '../Stream/HelixStream';

/** @private */
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
	@Enumerable(false) private readonly _client: ApiClient;

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

	/**
	 * Retrieves streams that are currently playing the game.
	 */
	async getStreams(pagination?: HelixPagination): Promise<HelixPaginatedResponse<HelixStream>> {
		return this._client.helix.streams.getStreams({ ...pagination, game: this._data.id });
	}

	/**
	 * Creates a paginator for streams that are currently playing the game.
	 */
	getStreamsPaginated(): HelixPaginatedRequest<HelixStreamData, HelixStream> {
		return this._client.helix.streams.getStreamsPaginated({ game: this._data.id });
	}
}
