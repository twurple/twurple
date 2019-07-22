import BaseAPI from '../../BaseAPI';
import { Cacheable, Cached } from '../../../Toolkit/Decorators/Cache';
import Team, { TeamData } from './Team';
import TeamUsers from './TeamUsers';
import User, { UserData } from '../User/User';

@Cacheable
export default class TeamAPI extends BaseAPI {

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

	@Cached(3600)
	async getTeamByName(team: string) {
		const teamData = await this._client.callAPI({ url: `teams/${team}` });
		teamData.users = teamData.users.map((data: UserData) => new User(data, this._client));
		return new TeamUsers(teamData, this._client);
	}
}
