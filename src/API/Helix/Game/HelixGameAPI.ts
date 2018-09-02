import BaseAPI from '../../BaseAPI';
import { TwitchApiCallType } from '../../../TwitchClient';
import HelixResponse from '../HelixResponse';
import HelixGame, { HelixGameData } from './HelixGame';

export type HelixGameFilterType = 'id' | 'name';

export default class HelixGameAPI extends BaseAPI {
	private async _getGames(filterType: HelixGameFilterType, filterValues: string | string[]) {
		const result = await this._client.apiCall<HelixResponse<HelixGameData[]>>({
			type: TwitchApiCallType.Helix,
			url: 'games',
			query: {
				[filterType]: filterValues
			}
		});

		return result.data.map(data => new HelixGame(data, this._client));
	}

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
		if (!games.length) {
			throw new Error('game not found');
		}
		return games[0];
	}

	/**
	 * Retrieves the game data for the given game name.
	 *
	 * @param name The game name you want to look up.
	 */
	async getGameByName(name: string) {
		const games = await this._getGames('name', name);
		if (!games.length) {
			throw new Error('game not found');
		}
		return games[0];
	}
}
