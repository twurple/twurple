/**
 * The action performed by a moderator.
 */
export type EventSubChannelModerationAction =
	| 'ban'
	| 'timeout'
	| 'unban'
	| 'untimeout'
	| 'clear'
	| 'delete'
	| 'emoteonly'
	| 'emoteonlyoff'
	| 'followers'
	| 'followersoff'
	| 'uniquechat'
	| 'uniquechatoff'
	| 'slow'
	| 'slowoff'
	| 'subscribers'
	| 'subscribersoff'
	| 'raid'
	| 'unraid'
	| 'mod'
	| 'unmod'
	| 'vip'
	| 'unvip'
	| 'add_blocked_term'
	| 'add_permitted_term'
	| 'remove_blocked_term'
	| 'remove_permitted_term'
	| 'approve_unban_request'
	| 'deny_unban_request';

/**
 * The type of AutoMod terms action.
 */
export type EventSubChannelAutomodTermsModerationEventAction = 'add' | 'remove';

/**
 * The list of AutoMod terms action.
 */
export type EventSubChannelAutomodTermsModerationEventList = 'blocked' | 'permitted';

/** @private */
export interface EventSubChannelBaseModerationEventData {
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	moderator_user_id: string;
	moderator_user_login: string;
	moderator_user_name: string;
	action: EventSubChannelModerationAction;
}

/** @private */
export interface EventSubChannelModerationEventUserPayload {
	user_id: string;
	user_login: string;
	user_name: string;
}

/** @private */
export interface EventSubChannelFollowersModerationEventPayload {
	follow_duration_minutes: number;
}

/** @private */
export interface EventSubChannelFollowersModerationEventData extends EventSubChannelBaseModerationEventData {
	action: Extract<EventSubChannelModerationAction, 'followers'>;
	followers: EventSubChannelFollowersModerationEventPayload;
}

/** @private */
export interface EventSubChannelSlowModerationEventPayload {
	wait_time_seconds: number;
}

/** @private */
export interface EventSubChannelSlowModerationEventData extends EventSubChannelBaseModerationEventData {
	action: Extract<EventSubChannelModerationAction, 'slow'>;
	slow: EventSubChannelSlowModerationEventPayload;
}

/** @private */
export interface EventSubChannelVipModerationEventData extends EventSubChannelBaseModerationEventData {
	action: Extract<EventSubChannelModerationAction, 'vip'>;
	vip: EventSubChannelModerationEventUserPayload;
}

/** @private */
export interface EventSubChannelUnvipModerationEventData extends EventSubChannelBaseModerationEventData {
	action: Extract<EventSubChannelModerationAction, 'unvip'>;
	unvip: EventSubChannelModerationEventUserPayload;
}

/** @private */
export interface EventSubChannelModModerationEventData extends EventSubChannelBaseModerationEventData {
	action: Extract<EventSubChannelModerationAction, 'mod'>;
	mod: EventSubChannelModerationEventUserPayload;
}

/** @private */
export interface EventSubChannelUnmodModerationEventData extends EventSubChannelBaseModerationEventData {
	action: Extract<EventSubChannelModerationAction, 'unmod'>;
	unmod: EventSubChannelModerationEventUserPayload;
}

/** @private */
export interface EventSubChannelBanModerationEventPayload extends EventSubChannelModerationEventUserPayload {
	reason: string;
}

/** @private */
export interface EventSubChannelBanModerationEventData extends EventSubChannelBaseModerationEventData {
	action: Extract<EventSubChannelModerationAction, 'ban'>;
	ban: EventSubChannelBanModerationEventPayload;
}

/** @private */
export interface EventSubChannelUnbanModerationEventData extends EventSubChannelBaseModerationEventData {
	action: Extract<EventSubChannelModerationAction, 'unban'>;
	unban: EventSubChannelModerationEventUserPayload;
}

/** @private */
export interface EventSubChannelTimeoutModerationEventPayload extends EventSubChannelModerationEventUserPayload {
	reason: string;
	expires_at: string;
}

/** @private */
export interface EventSubChannelTimeoutModerationEventData extends EventSubChannelBaseModerationEventData {
	action: Extract<EventSubChannelModerationAction, 'timeout'>;
	timeout: EventSubChannelTimeoutModerationEventPayload;
}

/** @private */
export interface EventSubChannelUntimeoutModerationEventData extends EventSubChannelBaseModerationEventData {
	action: Extract<EventSubChannelModerationAction, 'untimeout'>;
	untimeout: EventSubChannelModerationEventUserPayload;
}

/** @private */
export interface EventSubChannelRaidModerationEventPayload extends EventSubChannelModerationEventUserPayload {
	viewer_count: number;
}

/** @private */
export interface EventSubChannelRaidModerationEventData extends EventSubChannelBaseModerationEventData {
	action: Extract<EventSubChannelModerationAction, 'raid'>;
	raid: EventSubChannelRaidModerationEventPayload;
}

/** @private */
export interface EventSubChannelUnraidModerationEventData extends EventSubChannelBaseModerationEventData {
	action: Extract<EventSubChannelModerationAction, 'unraid'>;
	unraid: EventSubChannelModerationEventUserPayload;
}

/** @private */
export interface EventSubChannelDeleteModerationEventPayload extends EventSubChannelModerationEventUserPayload {
	message_id: string;
	message_body: string;
}

/** @private */
export interface EventSubChannelDeleteModerationEventData extends EventSubChannelBaseModerationEventData {
	action: Extract<EventSubChannelModerationAction, 'delete'>;
	delete: EventSubChannelDeleteModerationEventPayload;
}

/** @private */
export interface EventSubChannelAutoModTermsModerationEventPayload {
	action: EventSubChannelAutomodTermsModerationEventAction;
	list: EventSubChannelAutomodTermsModerationEventList;
	terms: string[];
	from_automod: boolean;
}

/** @private */
export interface EventSubChannelAutoModTermsModerationEventData extends EventSubChannelBaseModerationEventData {
	action: Extract<
		EventSubChannelModerationAction,
		'add_blocked_term' | 'add_permitted_term' | 'remove_blocked_term' | 'remove_permitted_term'
	>;
	automod_terms: EventSubChannelAutoModTermsModerationEventPayload;
}

/** @private */
export interface EventSubChannelUnbanRequestModerationEventPayload extends EventSubChannelModerationEventUserPayload {
	is_approved: boolean;
	moderator_message: string;
}

/** @private */
export interface EventSubChannelUnbanRequestModerationEventData extends EventSubChannelBaseModerationEventData {
	action: Extract<EventSubChannelModerationAction, 'approve_unban_request' | 'deny_unban_request'>;
	unban_request: EventSubChannelUnbanRequestModerationEventPayload;
}

/** @private */
export type EventSubChannelModerationActionEventData =
	| EventSubChannelBaseModerationEventData
	| EventSubChannelFollowersModerationEventData
	| EventSubChannelSlowModerationEventData
	| EventSubChannelVipModerationEventData
	| EventSubChannelUnvipModerationEventData
	| EventSubChannelModModerationEventData
	| EventSubChannelUnmodModerationEventData
	| EventSubChannelBanModerationEventData
	| EventSubChannelUnbanModerationEventData
	| EventSubChannelTimeoutModerationEventData
	| EventSubChannelUntimeoutModerationEventData
	| EventSubChannelRaidModerationEventData
	| EventSubChannelUnraidModerationEventData
	| EventSubChannelDeleteModerationEventData
	| EventSubChannelAutoModTermsModerationEventData
	| EventSubChannelUnbanRequestModerationEventData;
