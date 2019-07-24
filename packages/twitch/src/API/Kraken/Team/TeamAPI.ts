import BaseAPI from '../../BaseAPI';
import { Cacheable, Cached } from '../../../Toolkit/Decorators/Cache';
import Team, { TeamData } from './Team';
import TeamUsers from './TeamUsers';
import User, { UserData } from '../User/User';

/**
 * The API methods that deal with teams.
 *
 * Can be accessed using `client.kraken.teams` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = await TwitchClient.withCredentials(clientId, accessToken);
 * const team = await client.kraken.teams.getTeam('staff');
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
	async getTeam(
		page?: number, limit: number = 25,
	): Promise<TeamData[]> {
		const query: Record<string, string> = {};

		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		query.limit = limit.toString();

		const data = await this._client.callAPI({
			url: 'teams', query
		});

		return data.teams.map((follow: TeamData) => new Team(follow, this._client));
	}

	/**
	 * Retrieves the team data for the given team name.
	 *
	 * @param team The team name you want to look up.
	 */
	@Cached(3600)
	async getTeamByName(team: string) {
		const teamData = await this._client.callAPI({ url: `teams/${team}` });
		teamData.users = teamData.users.map((data: UserData) => new User(data, this._client));
		return new TeamUsers(teamData, this._client);
	}
}
