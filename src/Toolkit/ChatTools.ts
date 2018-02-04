/** @private */
export default class ChatTools {
	static parseEmotes(emotes?: string): Map<string, string[]> {
		if (!emotes) {
			return new Map;
		}

		return new Map(emotes.split('/').map(emote => {
			const [emoteId, placements] = emote.split(':', 2);
			return [emoteId, placements.split(',')] as [string, string[]];
		}));
	}
}
