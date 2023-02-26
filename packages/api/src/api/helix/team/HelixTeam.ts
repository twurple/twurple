import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../../client/BaseApiClient';
import { type HelixTeamData } from '../../../interfaces/helix/team.external';
import type { HelixUserRelation } from '../relations/HelixUserRelation';

/**
 * A Stream Team.
 */
@rtfm<HelixTeam>('api', 'HelixTeam', 'id')
export class HelixTeam extends DataObject<HelixTeamData> {
	/** @private */ @Enumerable(false) protected readonly _client: BaseApiClient;

	/** @private */
	constructor(data: HelixTeamData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the team.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The name of the team.
	 */
	get name(): string {
		return this[rawDataSymbol].team_name;
	}

	/**
	 * The display name of the team.
	 */
	get displayName(): string {
		return this[rawDataSymbol].team_display_name;
	}

	/**
	 * The URL of the background image of the team.
	 */
	get backgroundImageUrl(): string | null {
		return this[rawDataSymbol].background_image_url;
	}

	/**
	 * The URL of the banner of the team.
	 */
	get bannerUrl(): string | null {
		return this[rawDataSymbol].banner;
	}

	/**
	 * The date when the team was created.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * The date when the team was last updated.
	 */
	get updateDate(): Date {
		return new Date(this[rawDataSymbol].updated_at);
	}

	/**
	 * The info of the team.
	 *
	 * May contain HTML tags.
	 */
	get info(): string {
		return this[rawDataSymbol].info;
	}

	/**
	 * The URL of the thumbnail of the team's logo.
	 */
	get logoThumbnailUrl(): string {
		return this[rawDataSymbol].thumbnail_url;
	}

	/**
	 * Gets the relations to the members of the team.
	 */
	async getUserRelations(): Promise<HelixUserRelation[]> {
		const teamWithUsers = await this._client.teams.getTeamById(this.id);

		return teamWithUsers!.userRelations;
	}
}
