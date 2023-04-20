import { utf8Length, utf8Substring } from '@d-fischer/shared-utils';
import { type ParsedMessageCheerPart, type ParsedMessageEmotePart, type ParsedMessagePart } from './ParsedMessagePart';

/**
 * Transforms the parts of the given text that are marked as emotes.
 *
 * @param text The message text.
 * @param emoteOffsets The emote offsets. An emote name maps to a list of text ranges.
 */
export function parseEmotePositions(text: string, emoteOffsets: Map<string, string[]>): ParsedMessageEmotePart[] {
	return [...emoteOffsets.entries()]
		.flatMap(([emote, placements]) =>
			placements.map((placement): ParsedMessageEmotePart => {
				const [startStr, endStr] = placement.split('-');
				const start = +startStr;
				const end = +endStr;
				const name = utf8Substring(text, start, end + 1);

				return {
					type: 'emote',
					position: start,
					length: end - start + 1,
					id: emote,
					name
				};
			})
		)
		.sort((a, b) => a.position - b.position);
}

/**
 * Finds the positions of all cheermotes in the given message.
 *
 * @param text The message text.
 * @param names The names of the cheermotes to find.
 */
export function findCheermotePositions(text: string, names: string[]): ParsedMessageCheerPart[] {
	const result: ParsedMessageCheerPart[] = [];

	const re = new RegExp('(?<=^|\\s)([a-z]+(?:\\d+[a-z]+)*)(\\d+)(?=\\s|$)', 'gi');
	let match: RegExpExecArray | null = null;
	while ((match = re.exec(text))) {
		const name = match[1].toLowerCase();
		if (names.includes(name)) {
			const amount = Number(match[2]);
			result.push({
				type: 'cheer',
				name,
				amount,
				position: utf8Length(text.slice(0, match.index)),
				length: match[0].length
			});
		}
	}

	return result;
}

/**
 * Add text parts to the given list of message parts for all the text that's unaccounted for.
 *
 * @param text The message text.
 * @param otherPositions The parsed non-text parts of the message.
 */
export function fillTextPositions(text: string, otherPositions: ParsedMessagePart[]): ParsedMessagePart[] {
	const messageLength = utf8Length(text);
	if (!otherPositions.length) {
		return [
			{
				type: 'text',
				position: 0,
				length: messageLength,
				text: text
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
				text: utf8Substring(text, currentPosition, token.position)
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
			text: utf8Substring(text, currentPosition)
		});
	}

	return result;
}

/**
 * Parse a chat message with emotes and optionally cheermotes.
 *
 * @param text The message text.
 * @param emoteOffsets The emote offsets. An emote name maps to a list of text ranges.
 * @param cheermoteNames The names of the cheermotes to find. Will not do cheermote parsing if not given.
 */
export function parseChatMessage(
	text: string,
	emoteOffsets: Map<string, string[]>,
	cheermoteNames?: string[]
): ParsedMessagePart[] {
	if (!text) {
		return [];
	}

	const foundParts: ParsedMessagePart[] = parseEmotePositions(text, emoteOffsets);

	if (cheermoteNames) {
		foundParts.push(...findCheermotePositions(text, cheermoteNames));
		foundParts.sort((a, b) => a.position - b.position);
	}

	return fillTextPositions(text, foundParts);
}
