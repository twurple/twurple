import { MessageTypes } from 'ircv3';
import type { CheermoteList } from 'twitch';
import { ChatUser } from '../ChatUser';
import type { ParsedMessageCheerPart, ParsedMessagePart } from '../Toolkit/EmoteTools';
import { fillTextPositions, parseEmoteOffsets, parseEmotePositions } from '../Toolkit/EmoteTools';

export class TwitchPrivateMessage extends MessageTypes.Commands.PrivateMessage {
	get userInfo(): ChatUser {
		return new ChatUser(this._prefix!.nick, this._tags);
	}

	get channelId(): string | null {
		return this._tags.get('room-id') ?? null;
	}

	get isCheer(): boolean {
		return this._tags.has('bits') ?? false;
	}

	get totalBits(): number {
		return Number(this._tags.get('bits') ?? 0);
	}

	get emoteOffsets(): Map<string, string[]> {
		return parseEmoteOffsets(this._tags.get('emotes'));
	}

	parseEmotes(): ParsedMessagePart[] {
		const messageText = this.params.message;
		const foundEmotes: ParsedMessagePart[] = parseEmotePositions(messageText, this.emoteOffsets);

		return fillTextPositions(messageText, foundEmotes);
	}

	parseEmotesAndBits(cheermotes: CheermoteList): ParsedMessagePart[] {
		const messageText = this.params.message;
		const foundCheermotes = cheermotes.parseMessage(messageText);
		const foundEmotesAndCheermotes: ParsedMessagePart[] = [
			...parseEmotePositions(messageText, this.emoteOffsets),
			...foundCheermotes.map(
				(cheermote): ParsedMessageCheerPart => ({
					type: 'cheer',
					position: cheermote.position,
					length: cheermote.length,
					name: cheermote.name,
					amount: cheermote.amount,
					displayInfo: cheermote.displayInfo
				})
			)
		];

		foundEmotesAndCheermotes.sort((a, b) => a.position - b.position);

		return fillTextPositions(messageText, foundEmotesAndCheermotes);
	}
}
