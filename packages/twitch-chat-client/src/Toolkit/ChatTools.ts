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

/** @deprecated */
export function parseBits<T>(message: string, channelCheermotes: CheermoteList) {
	return channelCheermotes.parseMessage(message);
}
