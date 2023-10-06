import { type HelixChannelSearchFilter } from './search.input';

/** @private */
export interface HelixChannelSearchResultData {
	broadcaster_language: string;
	id: string;
	broadcaster_login: string;
	display_name: string;
	game_id: string;
	game_name: string;
	is_live: boolean;
	tags: string[];
	thumbnail_url: string;
	title: string;
	started_at: string;
}

/** @internal */
export function createSearchChannelsQuery(query: string, filter: HelixChannelSearchFilter) {
	return {
		query,
		live_only: filter.liveOnly?.toString(),
	};
}
