import { type EventSubChatBadge, type EventSubChatMessageData } from './common/EventSubChatMessage.external';

/**
 * The type of message that was sent.
 */
export type EventSubChatMessageType = 'text' | 'channel_points_highlighted' | 'channel_points_sub_only' | 'user_intro';

/** @private */
export interface EventSubChatMessageCheerData {
	bits: number;
}

/** @private */
export interface EventSubChatMessageReplyData {
	parent_message_id: string;
	parent_message_body: string;
	parent_user_id: string;
	parent_user_name: string;
	parent_user_login: string;
	thread_message_id: string;
	thread_user_id: string;
	thread_user_name: string;
	thread_user_login: string;
}

/** @private */
export interface EventSubChannelChatMessageEventData {
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	chatter_user_id: string;
	chatter_user_login: string;
	chatter_user_name: string;
	message_id: string;
	message: EventSubChatMessageData;
	message_type: EventSubChatMessageType;
	badges: EventSubChatBadge[];
	cheer: EventSubChatMessageCheerData | null;
	color: string;
	reply: EventSubChatMessageReplyData | null;
	channel_points_custom_reward_id: string | null;
	source_broadcaster_user_id: string | null;
	source_broadcaster_user_login: string | null;
	source_broadcaster_user_name: string | null;
	source_message_id: string | null;
	source_badges: EventSubChatBadge[] | null;
	is_source_only: boolean | null;
}
