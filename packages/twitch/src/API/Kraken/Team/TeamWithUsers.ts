import { rtfm } from 'twitch-common';
import type { UserData } from '../User/User';
import { User } from '../User/User';
import type { TeamData } from './Team';
import { Team } from './Team';

/** @private */
export interface TeamWithUsersData extends TeamData {
	users: UserData[];
}

/**
 * A Twitch team with additional data about its member users.
 */
@rtfm<TeamWithUsers>('twitch', 'TeamWithUsers', 'id')
export class TeamWithUsers extends Team {
	/** @private */ protected declare readonly _data: TeamWithUsersData;

	/**
	 * The list of users in the team.
	 */
	async getUsers(): Promise<User[]> {
		return this._data.users.map((data: UserData) => new User(data, this._client));
	}
}
