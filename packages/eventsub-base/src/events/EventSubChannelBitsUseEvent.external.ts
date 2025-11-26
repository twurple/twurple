import {
	type EventSubChatMessageCheermotePart,
	type EventSubChatMessageEmotePart,
	type EventSubChatMessageTextPart,
} from './common/EventSubChatMessage.external.js';
import { type EventSubChannelBitsUsePowerUpData } from './common/EventSubChannelBitsUsePowerUp.external.js';

/**
 * The type of bits usage.
 */
export type EventSubChannelBitsUseType = 'cheer' | 'power_up' | 'combo';

/** @private */
export type EventSubChannelBitsUseMessagePart =
	| EventSubChatMessageTextPart
	| EventSubChatMessageCheermotePart
	| EventSubChatMessageEmotePart;

/** @private */
export interface EventSubChannelBitsUseMessageData {
	text: string;
	fragments: EventSubChannelBitsUseMessagePart[];
}

/** @private */
export interface EventSubChannelBitsUseEventData {
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	bits: number;
	type: EventSubChannelBitsUseType;
	power_up: EventSubChannelBitsUsePowerUpData | null;
	message: EventSubChannelBitsUseMessageData | null;
}
