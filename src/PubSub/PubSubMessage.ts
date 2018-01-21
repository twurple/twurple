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

export interface PubSubChatMessage {
	message: string;
	emotes: PubSubChatMessageEmote[];
}

export interface PubSubSubscriptionMessage extends BasicMessageInfo {
	display_name: string;
	sub_plan: 'Prime' | '1000' | '2000' | '3000';
	sub_plan_name: string;
	months: number;
	context: 'sub' | 'resub';
	sub_message: PubSubChatMessage;
}

export interface PubSubCommerceMessage extends BasicMessageInfo {
	display_name: string;
	item_image_url: string;
	item_description: string;
	supports_channel: boolean;
	purchase_message: PubSubChatMessage;
}

type PubSubMessage = PubSubBitsMessage | PubSubSubscriptionMessage | PubSubCommerceMessage;
export default PubSubMessage;
