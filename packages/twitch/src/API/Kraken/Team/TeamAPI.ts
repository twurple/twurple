import { Cacheable, Cached } from '@d-fischer/cache-decorators';
import BaseAPI from '../../BaseAPI';
import Team, { TeamData } from './Team';
import TeamWithUsers from './TeamWithUsers';

/**
 * The API methods that deal with teams.
 *
 * Can be accessed using `client.kraken.teams` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = TwitchClient.withCredentials(clientId, accessToken);
 * const team = await client.kraken.teams.getTeamByName('staff');
 * ```
 */
@Cacheable
export default class TeamAPI extends BaseAPI {
	/**
	 * Get a list of teams.
	 *
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 */
	@Cached(3600)
	async getTeams(page?: number, limit: number = 25): Promise<TeamData[]> {
		const query: Record<string, string> = {};

		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		query.limit = limit.toString();

		const data = await this._client.callAPI({
			url: 'teams',
			query
		});

		return data.teams.map((team: TeamData) => new Team(team, this._client));
	}

	/**
	 * Retrieves the team data for the given team name.
	 *
	 * @param team The team name you want to look up.
	 */
	@Cached(3600)
	async getTeamByName(team: string): Promise<TeamWithUsers> {
		const teamData = await this._client.callAPI({ url: `teams/${team}` });
		return new TeamWithUsers(teamData, this._client);
	}
}
