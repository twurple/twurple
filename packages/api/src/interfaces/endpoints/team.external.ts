import { type HelixUserRelationData } from './generic.external.js';

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

/** @private */
export interface HelixTeamWithUsersData extends HelixTeamData {
	users: HelixUserRelationData[];
}
