import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import type { HelixPagination } from '../HelixPagination';
import type { HelixStream, HelixStreamData } from '../stream/HelixStream';

/** @private */
export interface HelixGameData {
	id: string;
	name: string;
	box_art_url: string;
}

/**
 * A game as displayed on Twitch.
 */
@rtfm<HelixGame>('api', 'HelixGame', 'id')
export class HelixGame extends DataObject<HelixGameData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixGameData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the game.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The name of the game.
	 */
	get name(): string {
		return this[rawDataSymbol].name;
	}

	/**
	 * The URL of the box art of the game.
	 */
	get boxArtUrl(): string {
		return this[rawDataSymbol].box_art_url;
	}

	/**
	 * Builds the URL of the box art of the game using the given dimensions.
	 *
	 * @param width The width of the box art.
	 * @param height The height of the box art.
	 */
	getBoxArtUrl(width: number, height: number): string {
		return this[rawDataSymbol].box_art_url
			.replace('{width}', width.toString())
			.replace('{height}', height.toString());
	}

	/**
	 * Retrieves streams that are currently playing the game.
	 *
	 * @param pagination
	 * @expandParams
	 */
	async getStreams(pagination?: HelixPagination): Promise<HelixPaginatedResult<HelixStream>> {
		return await this._client.streams.getStreams({ ...pagination, game: this[rawDataSymbol].id });
	}

	/**
	 * Creates a paginator for streams that are currently playing the game.
	 */
	getStreamsPaginated(): HelixPaginatedRequest<HelixStreamData, HelixStream> {
		return this._client.streams.getStreamsPaginated({ game: this[rawDataSymbol].id });
	}
}
