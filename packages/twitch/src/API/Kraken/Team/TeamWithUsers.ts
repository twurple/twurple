import { User, UserData } from '../User/User';
import { Team, TeamData } from './Team';

/** @private */
export interface TeamWithUsersData extends TeamData {
	users: UserData[];
}

export class TeamWithUsers extends Team {
	/** @private */
	protected _data: TeamWithUsersData;

	/**
	 * The list of users in the team.
	 */
	async getUsers() {
		return this._data.users.map((data: UserData) => new User(data, this._client));
	}
}
