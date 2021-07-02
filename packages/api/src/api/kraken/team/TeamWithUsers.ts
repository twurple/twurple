import { rawDataSymbol, rtfm } from '@twurple/common';
import type { UserData } from '../user/User';
import { User } from '../user/User';
import type { TeamData } from './Team';
import { Team } from './Team';

/** @private */
export interface TeamWithUsersData extends TeamData {
	users: UserData[];
}

/**
 * A Twitch team with additional data about its member users.
 *
 * @inheritDoc
 */
@rtfm<TeamWithUsers>('api', 'TeamWithUsers', 'id')
export class TeamWithUsers extends Team {
	/** @private */ declare readonly [rawDataSymbol]: TeamWithUsersData;

	/**
	 * The list of users in the team.
	 */
	get users(): User[] {
		return this[rawDataSymbol].users.map(data => new User(data, this._client));
	}
}
