import { TwitchApiCallType } from 'twitch-api-call';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixPagination } from '../HelixPagination';
import { makePaginationQuery } from '../HelixPagination';
import type { HelixPaginatedResponse, HelixResponse } from '../HelixResponse';
import type { HelixGameData } from './HelixGame';
import { HelixGame } from './HelixGame';

/** @private */
export type HelixGameFilterType = 'id' | 'name';

/**
 * The Helix API methods that deal with games.
 *
 * Can be accessed using `client.helix.games` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const game = await api.helix.games.getGameByName('Hearthstone');
 * ```
 */
export class HelixGameApi extends BaseApi {
	/**
	 * Retrieves the game data for the given list of game IDs.
	 *
	 * @param ids The game IDs you want to look up.
	 */
	async getGamesByIds(ids: string[]): Promise<HelixGame[]> {
		return this._getGames('id', ids);
	}

	/**
	 * Retrieves the game data for the given list of game names.
	 *
	 * @param names The game names you want to look up.
	 */
	async getGamesByNames(names: string[]): Promise<HelixGame[]> {
		return this._getGames('name', names);
	}

	/**
	 * Retrieves the game data for the given game ID.
	 *
	 * @param id The game ID you want to look up.
	 */
	async getGameById(id: string): Promise<HelixGame | null> {
		const games = await this._getGames('id', id);
		return games.length ? games[0] : null;
	}

	/**
	 * Retrieves the game data for the given game name.
	 *
	 * @param name The game name you want to look up.
	 */
	async getGameByName(name: string): Promise<HelixGame | null> {
		const games = await this._getGames('name', name);
		return games.length ? games[0] : null;
	}

	/**
	 * Retrieves a list of the most viewed games at the moment.
	 *
	 * @param pagination Pagination info.
	 */
	async getTopGames(pagination?: HelixPagination): Promise<HelixPaginatedResult<HelixGame>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixGameData>>({
			type: TwitchApiCallType.Helix,
			url: 'games/top',
			query: makePaginationQuery(pagination)
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
			(data: HelixGameData) => new HelixGame(data, this._client)
		);
	}

	private async _getGames(filterType: HelixGameFilterType, filterValues: string | string[]): Promise<HelixGame[]> {
		const result = await this._client.callApi<HelixResponse<HelixGameData>>({
			type: TwitchApiCallType.Helix,
			url: 'games',
			query: {
				[filterType]: filterValues
			}
		});

		return result.data.map(entry => new HelixGame(entry, this._client));
	}
}
