import Team, {TeamData} from './Team';
import User, {UserData} from '../User/User';
import TwitchClient from '../../../TwitchClient';

/** @private */
export interface TeamUsersData extends TeamData {
	users: UserData[];
}

export default class TeamWithUsers extends Team {
	/** @private */
	constructor(/** @private */ protected _data: TeamUsersData, client: TwitchClient) {
		super(_data, client);
	}

	/**
	 * The list of users in the team.
	 */
	async users(): Promise<User[]> {
		const users = this._data.users.map((data: UserData) => new User(data, this._client));
		return new Promise(resolve => resolve(users));
	}
}
