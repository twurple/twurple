import { Cacheable, Cached } from '@d-fischer/cache-decorators';
import { BaseApi } from '../../BaseApi';
import type { TeamData } from './Team';
import { Team } from './Team';
import { TeamWithUsers } from './TeamWithUsers';

/**
 * The API methods that deal with teams.
 *
 * Can be accessed using `client.kraken.teams` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const team = await api.kraken.teams.getTeamByName('staff');
 * ```
 */
@Cacheable
export class TeamApi extends BaseApi {
	/**
	 * Get a list of teams.
	 *
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 */
	@Cached(3600)
	async getTeams(page?: number, limit: number = 25): Promise<Team[]> {
		const query: Record<string, string> = {};

		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		query.limit = limit.toString();

		const data = await this._client.callApi<{ teams: TeamData[] }>({
			url: 'teams',
			query
		});

		return data.teams.map(teamData => new Team(teamData, this._client));
	}

	/**
	 * Retrieves the team data for the given team name.
	 *
	 * @param team The team name you want to look up.
	 */
	@Cached(3600)
	async getTeamByName(team: string): Promise<TeamWithUsers> {
		const teamData = await this._client.callApi<TeamData>({ url: `teams/${team}` });
		return new TeamWithUsers(teamData, this._client);
	}
}
