import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUserRelation } from '../relations/HelixUserRelation';

/** @private */
export interface HelixTeamData {
	id: string;
	team_name: string;
	team_display_name: string;
	background_image_url: string | null;
	banner: string | null;
	created_at: string;
	updated_at: string;
	info: string;
	thumbnail_url: string;
}

/**
 * A Stream Team.
 */
@rtfm<HelixTeam>('api', 'HelixTeam', 'id')
export class HelixTeam {
	/** @private */
	@Enumerable(false) protected readonly _data: HelixTeamData;
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixTeamData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the team.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The name of the team.
	 */
	get name(): string {
		return this._data.team_name;
	}

	/**
	 * The display name of the team.
	 */
	get displayName(): string {
		return this._data.team_display_name;
	}

	/**
	 * The URL of the background image of the team.
	 */
	get backgroundImageUrl(): string | null {
		return this._data.background_image_url;
	}

	/**
	 * The URL of the banner of the team.
	 */
	get bannerUrl(): string | null {
		return this._data.banner;
	}

	/**
	 * The date when the team was created.
	 */
	get creationDate(): Date {
		return new Date(this._data.created_at);
	}

	/**
	 * The date when the team was last updated.
	 */
	get updateDate(): Date {
		return new Date(this._data.updated_at);
	}

	/**
	 * The info of the team.
	 *
	 * May contain HTML tags.
	 */
	get info(): string {
		return this._data.info;
	}

	/**
	 * The URL of the thumbnail of the team's logo.
	 */
	get logoThumbnailUrl(): string {
		return this._data.thumbnail_url;
	}

	/**
	 * Retrieves the relations to the members of the team.
	 */
	async getUserRelations(): Promise<HelixUserRelation[]> {
		const teamWithUsers = await this._client.helix.teams.getTeamById(this.id);

		return teamWithUsers!.userRelations;
	}
}
