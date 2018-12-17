import BaseAPI from '../../BaseAPI';
import { TwitchAPICallType } from '../../../TwitchClient';
import HelixGame, { HelixGameData } from './HelixGame';
import HelixPaginatedRequest from '../HelixPaginatedRequest';
import HelixResponse from '../HelixResponse';

/** @private */
export type HelixGameFilterType = 'id' | 'name';

/**
 * The Helix API methods that deal with games.
 *
 * Can be accessed using `client.helix.games` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = new TwitchClient(options);
 * const game = await client.helix.games.getGameByName('Hearthstone');
 * ```
 */
export default class HelixGameAPI extends BaseAPI {
	/**
	 * Retrieves the game data for the given list of game IDs.
	 *
	 * @param ids The game IDs you want to look up.
	 */
	async getGamesByIds(ids: string[]) {
		return this._getGames('id', ids);
	}

	/**
	 * Retrieves the game data for the given list of game names.
	 *
	 * @param names The game names you want to look up.
	 */
	async getGamesByNames(names: string[]) {
		return this._getGames('name', names);
	}

	/**
	 * Retrieves the game data for the given game ID.
	 *
	 * @param id The game ID you want to look up.
	 */
	async getGameById(id: string) {
		const games = await this._getGames('id', id);
		return games.length ? games[0] : null;
	}

	/**
	 * Retrieves the game data for the given game name.
	 *
	 * @param name The game name you want to look up.
	 */
	async getGameByName(name: string) {
		const games = await this._getGames('name', name);
		return games.length ? games[0] : null;
	}

	private async _getGames(filterType: HelixGameFilterType, filterValues: string | string[]) {
		const data = await this._client.callAPI<HelixResponse<HelixGameData>>({
			type: TwitchAPICallType.Helix,
			url: 'games',
			query: {
				[filterType]: filterValues
			}
		});

		return data.data.map(entry => new HelixGame(entry, this._client));
	}

	async getTopGames() {
		// TODO next major: this method should not be async
		return new HelixPaginatedRequest(
			{
				type: TwitchAPICallType.Helix,
				url: 'games/top'
			},
			this._client,
			(data: HelixGameData) => new HelixGame(data, this._client)
		);
	}
}
