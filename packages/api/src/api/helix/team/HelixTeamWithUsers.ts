import { rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixTeamWithUsersData } from '../../../interfaces/helix/team.external';
import { HelixUserRelation } from '../relations/HelixUserRelation';
import { HelixTeam } from './HelixTeam';

/**
 * A Stream Team with its member relations.
 *
 * @inheritDoc
 */
@rtfm<HelixTeamWithUsers>('api', 'HelixTeamWithUsers', 'id')
export class HelixTeamWithUsers extends HelixTeam {
	/** @private */ declare readonly [rawDataSymbol]: HelixTeamWithUsersData;

	/**
	 * The relations to the members of the team.
	 */
	get userRelations(): HelixUserRelation[] {
		return this[rawDataSymbol].users.map(data => new HelixUserRelation(data, this._client));
	}
}
