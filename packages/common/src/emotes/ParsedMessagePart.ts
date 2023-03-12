import type { BasicMessageCheermote, MessageCheermote } from './BaseCheermoteList';
import type { ChatEmote } from './ChatEmote';

export interface ParsedMessageTextPart {
	type: 'text';
	position: number;
	length: number;
	text: string;
}

export interface BasicParsedMessageCheerPart extends BasicMessageCheermote {
	type: 'cheer';
}

export interface ParsedMessageCheerPart extends MessageCheermote {
	type: 'cheer';
}

export interface ParsedMessageEmotePart {
	type: 'emote';
	position: number;
	length: number;
	id: string;
	name: string;
	displayInfo: ChatEmote;
}

export type BasicParsedMessagePart = ParsedMessageTextPart | BasicParsedMessageCheerPart | ParsedMessageEmotePart;
export type ParsedMessagePart = ParsedMessageTextPart | ParsedMessageCheerPart | ParsedMessageEmotePart;
