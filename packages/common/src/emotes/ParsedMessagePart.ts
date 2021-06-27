import { utf8Length, utf8Substring } from '@d-fischer/shared-utils';
import type { CheermoteDisplayInfo } from './BaseCheermoteList';
import type { ChatEmote } from './ChatEmote';

export interface ParsedMessageTextPart {
	type: 'text';
	position: number;
	length: number;
	text: string;
}

export interface ParsedMessageCheerPart {
	type: 'cheer';
	position: number;
	length: number;
	name: string;
	amount: number;
	displayInfo: CheermoteDisplayInfo;
}

export interface ParsedMessageEmotePart {
	type: 'emote';
	position: number;
	length: number;
	id: string;
	name: string;
	displayInfo: ChatEmote;
}

export type ParsedMessagePart = ParsedMessageTextPart | ParsedMessageCheerPart | ParsedMessageEmotePart;

/** @private */
export function fillTextPositions(message: string, otherPositions: ParsedMessagePart[]): ParsedMessagePart[] {
	const messageLength = utf8Length(message);
	if (!otherPositions.length) {
		return [
			{
				type: 'text',
				position: 0,
				length: messageLength,
				text: message
			}
		];
	}

	const result: ParsedMessagePart[] = [];
	let currentPosition = 0;

	for (const token of otherPositions) {
		if (token.position > currentPosition) {
			result.push({
				type: 'text',
				position: currentPosition,
				length: token.position - currentPosition,
				text: utf8Substring(message, currentPosition, token.position)
			});
		}
		result.push(token);
		currentPosition = token.position + token.length;
	}

	if (currentPosition < messageLength) {
		result.push({
			type: 'text',
			position: currentPosition,
			length: messageLength - currentPosition,
			text: utf8Substring(message, currentPosition)
		});
	}

	return result;
}
