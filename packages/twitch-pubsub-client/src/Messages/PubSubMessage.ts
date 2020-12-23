import type { PubSubBitsBadgeUnlockMessage, PubSubBitsBadgeUnlockMessageData } from './PubSubBitsBadgeUnlockMessage';
import type { PubSubBitsMessage, PubSubBitsMessageData } from './PubSubBitsMessage';
import type { PubSubChatModActionMessage, PubSubChatModActionMessageData } from './PubSubChatModActionMessage';
import type { PubSubRedemptionMessage, PubSubRedemptionMessageData } from './PubSubRedemptionMessage';
import type { PubSubSubscriptionMessage, PubSubSubscriptionMessageData } from './PubSubSubscriptionMessage';
import type { PubSubWhisperMessage, PubSubWhisperMessageData } from './PubSubWhisperMessage';

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
