import type { BaseCheermoteList, CheermoteFormat, ParsedMessagePart } from '@twurple/common';
import { parseChatMessage, rtfm } from '@twurple/common';
import { MessageTypes } from 'ircv3';
import { ChatUser } from '../ChatUser';
import { parseEmoteOffsets } from '../utils/emoteUtil';
import { getMessageText } from '../utils/messageUtil';

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
	 * The date the message was sent at.
	 */
	get date(): Date {
		const timestamp = this._tags.get('tmi-sent-ts')!;
		return new Date(Number(timestamp));
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
	 * Whether the message represents a redemption of a custom channel points reward.
	 */
	get isRedemption(): boolean {
		return Boolean(this._tags.get('custom-reward-id'));
	}

	/**
	 * The ID of the redeemed reward, or `null` if the message does not represent a redemption.
	 */
	get rewardId(): string | null {
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		return this._tags.get('custom-reward-id') || null;
	}

	/**
	 * Whether the message is the first message of the chatter who sent it.
	 */
	get isFirst(): boolean {
		return this._tags.get('first-msg') === '1';
	}

	/**
	 * Whether the message is highlighted by using channel points.
	 */
	get isHighlight(): boolean {
		return this._tags.get('msg-id') === 'highlighted-message';
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
	 *
	 * @deprecated Use {@link parseChatMessage} instead.
	 */
	parseEmotes(): ParsedMessagePart[] {
		const messageText = getMessageText(this.params.content);

		return parseChatMessage(messageText, this.emoteOffsets) as ParsedMessagePart[];
	}

	/**
	 * Parses the message, separating text from emote usages and cheers.
	 *
	 * @deprecated Use {@link parseChatMessage} instead.
	 *
	 * @param cheermotes A list of cheermotes.
	 * @param cheermoteFormat The format to show the cheermotes in.
	 */
	parseEmotesAndBits(cheermotes: BaseCheermoteList<unknown>, cheermoteFormat: CheermoteFormat): ParsedMessagePart[] {
		const messageText = getMessageText(this.params.content);

		return parseChatMessage(messageText, this.emoteOffsets, cheermotes.getPossibleNames()).map(part =>
			part.type === 'cheer'
				? {
						...part,
						displayInfo: cheermotes.getCheermoteDisplayInfo(part.name, part.amount, cheermoteFormat)
				  }
				: part
		);
	}
}
