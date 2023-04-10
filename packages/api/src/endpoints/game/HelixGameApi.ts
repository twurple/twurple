import type { HelixPaginatedResponse, HelixResponse } from '@twurple/api-call';
import { rtfm } from '@twurple/common';
import { type HelixGameData } from '../../interfaces/endpoints/game.external';
import { HelixPaginatedRequest } from '../../utils/pagination/HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../../utils/pagination/HelixPaginatedResult';
import { createPaginatedResult } from '../../utils/pagination/HelixPaginatedResult';
import type { HelixPagination } from '../../utils/pagination/HelixPagination';
import { createPaginationQuery } from '../../utils/pagination/HelixPagination';
import { BaseApi } from '../BaseApi';
import { HelixGame } from './HelixGame';

/** @private */
type HelixGameFilterType = 'id' | 'name' | 'igdb_id';

/**
 * The Helix API methods that deal with games.
 *
 * Can be accessed using `client.games` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient({ authProvider });
 * const game = await api.games.getGameByName('Hearthstone');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Games
 */
@rtfm('api', 'HelixGameApi')
export class HelixGameApi extends BaseApi {
	/**
	 * Gets the game data for the given list of game IDs.
	 *
	 * @param ids The game IDs you want to look up.
	 */
	async getGamesByIds(ids: string[]): Promise<HelixGame[]> {
		return await this._getGames('id', ids);
	}

	/**
	 * Gets the game data for the given list of game names.
	 *
	 * @param names The game names you want to look up.
	 */
	async getGamesByNames(names: string[]): Promise<HelixGame[]> {
		return await this._getGames('name', names);
	}

	/**
	 * Gets the game data for the given list of IGDB IDs.
	 *
	 * @param igdbIds The IGDB IDs you want to look up.
	 */
	async getGamesByIgdbIds(igdbIds: string[]): Promise<HelixGame[]> {
		return await this._getGames('igdb_id', igdbIds);
	}

	/**
	 * Gets the game data for the given game ID.
	 *
	 * @param id The game ID you want to look up.
	 */
	async getGameById(id: string): Promise<HelixGame | null> {
		const games = await this._getGames('id', [id]);
		return games[0] ?? null;
	}

	/**
	 * Gets the game data for the given game name.
	 *
	 * @param name The game name you want to look up.
	 */
	async getGameByName(name: string): Promise<HelixGame | null> {
		const games = await this._getGames('name', [name]);
		return games[0] ?? null;
	}

	/**
	 * Gets the game data for the given IGDB ID.
	 *
	 * @param igdbId The IGDB ID you want to look up.
	 */
	async getGameByIgdbId(igdbId: string): Promise<HelixGame | null> {
		const games = await this._getGames('igdb_id', [igdbId]);
		return games[0] ?? null;
	}

	/**
	 * Gets a list of the most viewed games at the moment.
	 *
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getTopGames(pagination?: HelixPagination): Promise<HelixPaginatedResult<HelixGame>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixGameData>>({
			type: 'helix',
			url: 'games/top',
			query: createPaginationQuery(pagination)
		});

		return createPaginatedResult(result, HelixGame, this._client);
	}

	/**
	 * Creates a paginator for the most viewed games at the moment.
	 */
	getTopGamesPaginated(): HelixPaginatedRequest<HelixGameData, HelixGame> {
		return new HelixPaginatedRequest(
			{
				url: 'games/top'
			},
			this._client,
			data => new HelixGame(data, this._client)
		);
	}

	private async _getGames(filterType: HelixGameFilterType, filterValues: string[]): Promise<HelixGame[]> {
		if (!filterValues.length) {
			return [];
		}
		const result = await this._client.callApi<HelixResponse<HelixGameData>>({
			type: 'helix',
			url: 'games',
			query: {
				[filterType]: filterValues
			}
		});

		return result.data.map(entry => new HelixGame(entry, this._client));
	}
}
