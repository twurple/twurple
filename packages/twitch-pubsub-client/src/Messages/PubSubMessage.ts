import { PubSubBitsBadgeUnlockMessage, PubSubBitsBadgeUnlockMessageData } from './PubSubBitsBadgeUnlockMessage';
import { PubSubBitsMessage, PubSubBitsMessageData } from './PubSubBitsMessage';
import { PubSubChatModActionMessage, PubSubChatModActionMessageData } from './PubSubChatModActionMessage';
import { PubSubRedemptionMessage, PubSubRedemptionMessageData } from './PubSubRedemptionMessage';
import { PubSubSubscriptionMessage, PubSubSubscriptionMessageData } from './PubSubSubscriptionMessage';
import { PubSubWhisperMessage, PubSubWhisperMessageData } from './PubSubWhisperMessage';

export interface PubSubBasicMessageInfo {
	user_name: string;
	channel_name: string;
	user_id: string;
	channel_id: string;
	time: string;
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

export type PubSubMessageData =
	| PubSubBitsMessageData
	| PubSubBitsBadgeUnlockMessageData
	| PubSubChatModActionMessageData
	| PubSubRedemptionMessageData
	| PubSubSubscriptionMessageData
	| PubSubWhisperMessageData;

export type PubSubMessage =
	| PubSubBitsMessage
	| PubSubBitsBadgeUnlockMessage
	| PubSubChatModActionMessage
	| PubSubRedemptionMessage
	| PubSubSubscriptionMessage
	| PubSubWhisperMessage;
