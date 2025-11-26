import { extractUserId, type UserIdResolvable } from '@twurple/common';
import { type HelixClipIdFilter } from './clip.input.js';

/** @private */
export interface HelixClipData {
	id: string;
	url: string;
	embed_url: string;
	broadcaster_id: string;
	broadcaster_name: string;
	creator_id: string;
	creator_name: string;
	video_id: string;
	game_id: string;
	language: string;
	title: string;
	view_count: number;
	created_at: string;
	thumbnail_url: string;
	duration: number;
	vod_offset: number | null;
	is_featured: boolean;
}

/** @private */
export type HelixClipFilterType = 'broadcaster_id' | 'game_id' | 'id';

/** @private */
export interface HelixClipCreateResponse {
	id: string;
	edit_url: string;
}

/** @internal */
export function createClipCreateQuery(channel: UserIdResolvable, createAfterDelay: boolean) {
	return {
		broadcaster_id: extractUserId(channel),
		has_delay: createAfterDelay.toString(),
	};
}

/** @internal */
export function createClipQuery(params: HelixClipIdFilter) {
	const { filterType, ids, startDate, endDate, isFeatured } = params;
	return {
		[filterType]: ids,
		started_at: startDate,
		ended_at: endDate,
		is_featured: isFeatured?.toString(),
	};
}
