import { type EventSubChannelSuspiciousUserLowTrustStatus } from './common/EventSubChannelSuspiciousUserLowTrustStatus.js';

/**
 * User types (if any) that apply to the suspicious user.
 */
export type EventSubChannelSuspiciousUserType = 'manually_added' | 'ban_evader' | 'banned_in_shared_channel';

/**
 * A ban evasion likelihood value (if any) that as been applied to the user automatically by Twitch.
 */
export type EventSubChannelBanEvasionEvaluation = 'possible' | 'likely' | 'unknown';

/** @private */
export interface EventSubChannelSuspiciousUserMessageTextPart {
	type: 'text';
	text: string;
}

/** @private */
export interface EventSubChannelSuspiciousUserMessageEmoteData {
	id: string;
	emote_set_id: string;
}

/** @private */
export interface EventSubChannelSuspiciousUserMessageEmotePart {
	type: 'emote';
	text: string;
	emote: EventSubChannelSuspiciousUserMessageEmoteData;
}

/** @private */
export interface EventSubChannelSuspiciousUserMessageCheermoteData {
	prefix: string;
	bits: number;
	tier: number;
}

/** @private */
export interface EventSubChannelSuspiciousUserMessageCheermotePart {
	type: 'cheermote';
	text: string;
	cheermote: EventSubChannelSuspiciousUserMessageCheermoteData;
}

/** @private */
export type EventSubChannelSuspiciousUserMessagePart =
	| EventSubChannelSuspiciousUserMessageTextPart
	| EventSubChannelSuspiciousUserMessageEmotePart
	| EventSubChannelSuspiciousUserMessageCheermotePart;

/** @private */
export interface EventSubChannelSuspiciousUserMessageData {
	message_id: string;
	text: string;
	fragments: EventSubChannelSuspiciousUserMessagePart[];
}

/** @private */
export interface EventSubChannelSuspiciousUserMessageEventData {
	broadcaster_user_id: string;
	broadcaster_user_name: string;
	broadcaster_user_login: string;
	user_id: string;
	user_name: string;
	user_login: string;
	low_trust_status: EventSubChannelSuspiciousUserLowTrustStatus;
	shared_ban_channel_ids: string[] | null;
	types: EventSubChannelSuspiciousUserType[];
	ban_evasion_evaluation: EventSubChannelBanEvasionEvaluation;
	message: EventSubChannelSuspiciousUserMessageData;
}
