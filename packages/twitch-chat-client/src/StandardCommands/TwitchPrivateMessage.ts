import { MessageTypes } from 'ircv3';
import { rtfm } from 'twitch-common';
import type { BaseCheermoteList } from 'twitch-common';
import { ChatUser } from '../ChatUser';
import type { ParsedMessageCheerPart, ParsedMessagePart } from '../Toolkit/EmoteTools';
import { fillTextPositions, parseEmoteOffsets, parseEmotePositions } from '../Toolkit/EmoteTools';

/**
 * An IRC PRIVMSG, with easy accessors for commonly used data from its tags.
 */
@rtfm<TwitchPrivateMessage>('twitch-chat-client', 'TwitchPrivateMessage', 'id')
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
	 * The number of bits cheered with the message.
	 *
	 * @deprecated Use {@TwitchPrivateMessage#bits} instead.
	 */
	get totalBits(): number {
		return this.bits;
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
		const messageText = this.params.message;
		const foundEmotes: ParsedMessagePart[] = parseEmotePositions(messageText, this.emoteOffsets);

		return fillTextPositions(messageText, foundEmotes);
	}

	/**
	 * Parses the message, separating text from emote usages and cheers.
	 *
	 * @param cheermotes A list of cheermotes
	 */
	parseEmotesAndBits(cheermotes: BaseCheermoteList): ParsedMessagePart[] {
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
