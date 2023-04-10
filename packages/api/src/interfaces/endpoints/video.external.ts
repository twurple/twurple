export type HelixVideoViewableStatus = 'public' | 'private';
export type HelixVideoType = 'upload' | 'archive' | 'highlight';

/**
 * Data about a muted segment in a video.
 */
export interface HelixVideoMutedSegmentData {
	/**
	 * The start of the muted segment, in seconds from the start.
	 */
	offset: number;

	/**
	 * The duration of the muted segment, in seconds.
	 */
	duration: number;
}

/** @private */
export interface HelixVideoData {
	id: string;
	user_id: string;
	user_login: string;
	user_name: string;
	title: string;
	description: string;
	created_at: string;
	published_at: string;
	url: string;
	thumbnail_url: string;
	viewable: HelixVideoViewableStatus;
	view_count: number;
	language: string;
	type: HelixVideoType;
	duration: string;
	stream_id: string | null;
	muted_segments: HelixVideoMutedSegmentData[] | null;
}

export type HelixVideoFilterPeriod = 'all' | 'day' | 'week' | 'month';
export type HelixVideoSort = 'time' | 'trending' | 'views';
