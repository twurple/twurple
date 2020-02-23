import { utf8Length, utf8Substring } from '@d-fischer/shared-utils';
import { CheermoteDisplayInfo } from 'twitch';

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
}

export type ParsedMessagePart = ParsedMessageTextPart | ParsedMessageCheerPart | ParsedMessageEmotePart;

/** @private */
export function parseEmoteOffsets(emotes?: string): Map<string, string[]> {
	if (!emotes) {
		return new Map();
	}

	return new Map(
		emotes.split('/').map(emote => {
			const [emoteId, placements] = emote.split(':', 2);
			return [emoteId, placements.split(',')] as [string, string[]];
		})
	);
}

/** @private */
export function parseEmotePositions(message: string, emoteOffsets: Map<string, string[]>) {
	return [...emoteOffsets.entries()]
		.flatMap(([emote, placements]) =>
			placements.map(
				(placement): ParsedMessageEmotePart => {
					const [startStr, endStr] = placement.split('-');
					const start = +startStr;
					const end = +endStr;

					return {
						type: 'emote',
						position: start,
						length: end - start + 1,
						id: emote,
						name: utf8Substring(message, start, end + 1)
					};
				}
			)
		)
		.sort((a, b) => a.position - b.position);
}

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
