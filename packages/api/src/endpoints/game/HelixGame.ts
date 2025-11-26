import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient.js';
import { type HelixGameData } from '../../interfaces/endpoints/game.external.js';
import { type HelixStreamData } from '../../interfaces/endpoints/stream.external.js';
import type { HelixPaginatedRequest } from '../../utils/pagination/HelixPaginatedRequest.js';
import type { HelixPaginatedResult } from '../../utils/pagination/HelixPaginatedResult.js';
import type { HelixPagination } from '../../utils/pagination/HelixPagination.js';
import type { HelixStream } from '../stream/HelixStream.js';

/**
 * A game as displayed on Twitch.
 */
@rtfm<HelixGame>('api', 'HelixGame', 'id')
export class HelixGame extends DataObject<HelixGameData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixGameData, client: BaseApiClient) {
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
	 * The IGDB ID of the game, or null if the game doesn't have an IGDB ID assigned at Twitch.
	 */
	get igdbId(): string | null {
		return this[rawDataSymbol].igdb_id || null;
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
	 * Gets streams that are currently playing the game.
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
