/**
 * The type of the stream going live.
 */
export type EventSubStreamOnlineEventStreamType = 'live' | 'playlist' | 'watch_party' | 'premiere' | 'rerun';

/** @private */
export interface EventSubStreamOnlineEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	type: EventSubStreamOnlineEventStreamType;
	started_at: string;
}
