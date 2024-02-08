/** @private */
export interface EventSubChatBadge {
	set_id: string;
	id: string;
	info: string;
}

/** @private */
export interface EventSubChatMessageTextPart {
	type: 'text';
	text: string;
}

/** @private */
export interface EventSubChatMessageCheermote {
	prefix: string;
	bits: number;
	tier: number;
}

/** @private */
export interface EventSubChatMessageCheermotePart {
	type: 'cheermote';
	cheermote: EventSubChatMessageCheermote;
}

/** @private */
export interface EventSubChatMessageEmote {
	id: string;
	emote_set_id: string;
	owner_id: string;
	format: string[];
}

/** @private */
export interface EventSubChatMessageEmotePart {
	type: 'emote';
	emote: EventSubChatMessageEmote;
}

/** @private */
export interface EventSubChatMessageMention {
	user_id: string;
	user_name: string;
	user_login: string;
}

/** @private */
export interface EventSubChatMessageMentionPart {
	type: 'mention';
	mention: EventSubChatMessageMention;
}

/** @private */
export type EventSubChatMessagePart =
	| EventSubChatMessageTextPart
	| EventSubChatMessageCheermotePart
	| EventSubChatMessageEmotePart
	| EventSubChatMessageMentionPart;

/** @private */
export interface EventSubChatMessageData {
	text: string;
	fragments: EventSubChatMessagePart[];
}
