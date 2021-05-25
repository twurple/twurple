import { rtfm } from '@twurple/common';
import type { HelixUserRelationData } from '../relations/HelixUserRelation';
import { HelixUserRelation } from '../relations/HelixUserRelation';
import type { HelixTeamData } from './HelixTeam';
import { HelixTeam } from './HelixTeam';

/** @private */
export interface HelixTeamWithUsersData extends HelixTeamData {
	users: HelixUserRelationData[];
}

/**
 * A Stream Team with its member relations.
 *
 * @inheritDoc
 */
@rtfm<HelixTeamWithUsers>('api', 'HelixTeamWithUsers', 'id')
export class HelixTeamWithUsers extends HelixTeam {
	/** @private */ protected declare readonly _data: HelixTeamWithUsersData;

	/**
	 * The relations to the members of the team.
	 */
	get userRelations(): HelixUserRelation[] {
		return this._data.users.map(data => new HelixUserRelation(data, this._client));
	}
}
