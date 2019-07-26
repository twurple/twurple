import Team, { TeamData } from './Team';
import User, { UserData } from '../User/User';

/** @private */
export interface TeamWithUsersData extends TeamData {
	users: UserData[];
}

export default class TeamWithUsers extends Team {
	/** @private */
	protected _data: TeamWithUsersData;

	/**
	 * The list of users in the team.
	 */
	async getUsers() {
		return this._data.users.map((data: UserData) => new User(data, this._client));
	}
}
