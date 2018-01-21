import PubSubWhisperMessage, { PubSubWhisperMessageData } from './PubSubWhisperMessage';
import PubSubCommerceMessage, { PubSubCommerceMessageData } from './PubSubCommerceMessage';
import PubSubSubscriptionMessage, { PubSubSubscriptionMessageData } from './PubSubSubscriptionMessage';
import PubSubBitsMessage, { PubSubBitsMessageData } from './PubSubBitsMessage';

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

type PubSubMessageData = PubSubBitsMessageData | PubSubSubscriptionMessageData | PubSubCommerceMessageData | PubSubWhisperMessageData;
export { PubSubMessageData };

type PubSubMessage = PubSubBitsMessage | PubSubSubscriptionMessage | PubSubCommerceMessage | PubSubWhisperMessage;
export default PubSubMessage;
