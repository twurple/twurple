import Team, { TeamData } from './Team';
import { UserData } from '../User/User';
import TwitchClient from '../../../TwitchClient';

/** @private */
export interface TeamUsersData extends TeamData {
	users: UserData[];
}

export default class TeamUsers extends Team {

	constructor(/** @private */ protected _data: TeamUsersData, client: TwitchClient) {
		super(_data, client);
	}

	get users() {
		return this._data.users;
	}
}
