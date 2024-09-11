import {
	type EventSubChatMessageCheermotePart,
	type EventSubChatMessageEmotePart,
	type EventSubChatMessageTextPart,
} from './EventSubChatMessage.external';

/** @private */
export type EventSubAutoModMessagePart =
	| EventSubChatMessageTextPart
	| EventSubChatMessageCheermotePart
	| EventSubChatMessageEmotePart;

/** @private */
export interface EventSubAutoModMessageData {
	text: string;
	fragments: EventSubAutoModMessagePart[];
}
