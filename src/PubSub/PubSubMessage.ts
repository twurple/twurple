// TODO add wrapper classes for these data objects

import { HelixUserType } from '../API/Helix/User/HelixUser';

export interface BasicMessageInfo {
	user_name: string;
	channel_name: string;
	user_id: string;
	channel_id: string;
	time: string;
}

export interface PubSubBitsMessageBitsEntitlement {
	previous_version: number;
	new_version: number;
}

export interface PubSubBitsMessageContent extends BasicMessageInfo {
	chat_message: string;
	bits_used: number;
	total_bits_used: number;
	context: 'cheer'; // TODO is this complete?
	badge_entitlement: PubSubBitsMessageBitsEntitlement | null;
}

export interface PubSubBitsMessage {
	data: PubSubBitsMessageContent;
	version: string;
	message_type: string;
	message_id: string;
}

export interface PubSubChatMessageEmote {
	start: number;
	end: number;
	id: number;
}

export interface PubSubChatMessageBadge {
	id: string;
	version: string;
}

export interface PubSubChatMessage {
	message: string;
	emotes: PubSubChatMessageEmote[];
}

export interface PubSubSubscriptionDetail {
	context: 'sub' | 'resub';
}

export interface PubSubSubscriptionGiftDetail {
	context: 'subgift';
	recipient_id: string;
	recipient_user_name: string;
	recipient_display_name: string;
}

export type PubSubSubscriptionMessage = BasicMessageInfo & {
	display_name: string;
	sub_plan: 'Prime' | '1000' | '2000' | '3000';
	sub_plan_name: string;
	months: number;
	sub_message: PubSubChatMessage;
} & (PubSubSubscriptionDetail | PubSubSubscriptionGiftDetail);

export interface PubSubCommerceMessage extends BasicMessageInfo {
	display_name: string;
	item_image_url: string;
	item_description: string;
	supports_channel: boolean;
	purchase_message: PubSubChatMessage;
}

export interface PubSubWhisperTags {
	login: string;
	display_name: string;
	color: string;
	user_type: HelixUserType;
	emotes: PubSubChatMessageEmote[];
	badges: PubSubChatMessageBadge[];
}

export interface PubSubWhisperRecipient {
	id: number; // Twitch pls...
	username: string;
	display_name: string;
	color: string;
	user_type: HelixUserType;
	badges: PubSubChatMessageBadge[];
	profile_image: string | null;
}

export interface PubSubWhisperMessageContent {
	id: number;
	message_id: string;
	thread_id: string;
	body: string;
	sent_ts: number;
	from_id: number; // Twitch pls...
	tags: PubSubWhisperTags;
	recipient: PubSubWhisperRecipient;
}

export interface PubSubWhisperMessage {
	type: 'whisper_received';
	data: string;
	data_object: PubSubWhisperMessageContent;
}

type PubSubMessage = PubSubBitsMessage | PubSubSubscriptionMessage | PubSubCommerceMessage | PubSubWhisperMessage;
export default PubSubMessage;
