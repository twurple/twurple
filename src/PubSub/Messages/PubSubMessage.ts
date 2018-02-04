import PubSubWhisperMessage, { PubSubWhisperMessageData } from './PubSubWhisperMessage';
import PubSubCommerceMessage, { PubSubCommerceMessageData } from './PubSubCommerceMessage';
import PubSubSubscriptionMessage, { PubSubSubscriptionMessageData } from './PubSubSubscriptionMessage';
import PubSubBitsMessage, { PubSubBitsMessageData } from './PubSubBitsMessage';

/** @private */
export interface PubSubBasicMessageInfo {
	user_name: string;
	channel_name: string;
	user_id: string;
	channel_id: string;
	time: string;
}

/** @private */
export interface PubSubChatMessageEmote {
	start: number;
	end: number;
	id: number;
}

/** @private */
export interface PubSubChatMessageBadge {
	id: string;
	version: string;
}

/** @private */
export interface PubSubChatMessage {
	message: string;
	emotes: PubSubChatMessageEmote[];
}

/** @private */
type PubSubMessageData = PubSubBitsMessageData | PubSubSubscriptionMessageData | PubSubCommerceMessageData | PubSubWhisperMessageData;
export { PubSubMessageData };

/** @private */
type PubSubMessage = PubSubBitsMessage | PubSubSubscriptionMessage | PubSubCommerceMessage | PubSubWhisperMessage;
export default PubSubMessage;
