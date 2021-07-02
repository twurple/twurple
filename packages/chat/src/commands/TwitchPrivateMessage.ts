import type { BaseCheermoteList, ParsedMessageCheerPart, ParsedMessagePart } from '@twurple/common';
import { fillTextPositions, rtfm } from '@twurple/common';
import { MessageTypes } from 'ircv3';
import { ChatUser } from '../ChatUser';
import { parseEmoteOffsets, parseEmotePositions } from '../utils/emoteUtil';

/**
 * An IRC PRIVMSG, with easy accessors for commonly used data from its tags.
 */
@rtfm<TwitchPrivateMessage>('chat', 'TwitchPrivateMessage', 'id')
export class TwitchPrivateMessage extends MessageTypes.Commands.PrivateMessage {
	/**
	 * The ID of the message.
	 */
	get id(): string {
		return this._tags.get('id')!;
	}

	/**
	 * Info about the user that send the message, like their user ID and their status in the current channel.
	 */
	get userInfo(): ChatUser {
		return new ChatUser(this._prefix!.nick, this._tags);
	}

	/**
	 * The ID of the channel the message is in.
	 */
	get channelId(): string | null {
		return this._tags.get('room-id') ?? null;
	}

	/**
	 * Whether the message is a cheer.
	 */
	get isCheer(): boolean {
		return this._tags.has('bits');
	}

	/**
	 * The number of bits cheered with the message.
	 */
	get bits(): number {
		return Number(this._tags.get('bits') ?? 0);
	}

	/**
	 * The offsets of emote usages in the message.
	 */
	get emoteOffsets(): Map<string, string[]> {
		return parseEmoteOffsets(this._tags.get('emotes'));
	}

	/**
	 * Parses the message, separating text from emote usages.
	 */
	parseEmotes(): ParsedMessagePart[] {
		const messageText = this.params.content;
		const foundEmotes: ParsedMessagePart[] = parseEmotePositions(messageText, this.emoteOffsets);

		return fillTextPositions(messageText, foundEmotes);
	}

	/**
	 * Parses the message, separating text from emote usages and cheers.
	 *
	 * @param cheermotes A list of cheermotes
	 */
	parseEmotesAndBits(cheermotes: BaseCheermoteList<unknown>): ParsedMessagePart[] {
		const messageText = this.params.content;
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
