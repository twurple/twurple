import { utf8Substring } from '@d-fischer/shared-utils';
import type { ParsedMessageEmotePart } from '@twurple/common';
import { ChatEmote } from '@twurple/common';

/** @private */
export function parseEmoteOffsets(emotes?: string): Map<string, string[]> {
	if (!emotes) {
		return new Map<string, string[]>();
	}

	return new Map(
		emotes
			.split('/')
			.map(emote => {
				const [emoteId, placements] = emote.split(':', 2);
				if (!placements) {
					return null;
				}
				return [emoteId, placements.split(',')] as [string, string[]];
			})
			.filter((e): e is [string, string[]] => e !== null)
	);
}

/** @private */
export function parseEmotePositions(message: string, emoteOffsets: Map<string, string[]>): ParsedMessageEmotePart[] {
	return [...emoteOffsets.entries()]
		.flatMap(([emote, placements]) =>
			placements.map((placement): ParsedMessageEmotePart => {
				const [startStr, endStr] = placement.split('-');
				const start = +startStr;
				const end = +endStr;
				const name = utf8Substring(message, start, end + 1);

				return {
					type: 'emote',
					position: start,
					length: end - start + 1,
					id: emote,
					name,
					displayInfo: new ChatEmote({
						code: name,
						id: emote
					})
				};
			})
		)
		.sort((a, b) => a.position - b.position);
}
