import { MessageCheermote } from '../StandardCommands/PrivateMessage';
import { CheermoteList } from 'twitch';

/** @private */
export function parseEmotes(emotes?: string): Map<string, string[]> {
	if (!emotes) {
		return new Map;
	}

	return new Map(emotes.split('/').map(emote => {
		const [emoteId, placements] = emote.split(':', 2);
		return [emoteId, placements.split(',')] as [string, string[]];
	}));
}

export function parseBits(message: string, channelCheermotes: CheermoteList) {
	const result: MessageCheermote[] = [];

	const names = channelCheermotes.getPossibleNames();
	// TODO fix this regex so it works in firefox, which does not support lookbehind
	const re = new RegExp('(?<=^|\s)([a-z]+)(\d+)(?=\s|$)', 'gi');
	let match: RegExpExecArray | null;
	// tslint:disable-next-line:no-conditional-assignment
	while (match = re.exec(message)) {
		const name = match[1].toLowerCase();
		const amount = Number(match[2]);
		if (names.includes(name)) {
			result.push({
				name,
				amount,
				position: match.index
			});
		}
	}

	return result;
}
