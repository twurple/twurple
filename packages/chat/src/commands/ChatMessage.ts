import { mapNullable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import { MessageTypes } from 'ircv3';
import { ChatUser } from '../ChatUser';
import { parseEmoteOffsets } from '../utils/emoteUtil';

// yes, this is necessary. pls fix twitch
const HYPE_CHAT_LEVELS = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];

/**
 * A regular chat message.
 */
@rtfm<ChatMessage>('chat', 'ChatMessage', 'id')
export class ChatMessage extends MessageTypes.Commands.PrivateMessage {
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
	 * Whether the message is sent by a returning chatter.
	 *
	 * Twitch defines this as a new viewer who has chatted at least twice in the last 30 days.
	 */
	get isReturningChatter(): boolean {
		return this._tags.get('returning-chatter') === '1';
	}

	/**
	 * Whether the message is highlighted by using channel points.
	 */
	get isHighlight(): boolean {
		return this._tags.get('msg-id') === 'highlighted-message';
	}

	/**
	 * Whether the message is a reply to another message.
	 */
	get isReply(): boolean {
		return this._tags.has('reply-parent-msg-id');
	}

	/**
	 * The ID of the message that this message is a reply to, or `null` if it's not a reply.
	 */
	get parentMessageId(): string | null {
		return this._tags.get('reply-parent-msg-id') ?? null;
	}

	/**
	 * The text of the message that this message is a reply to, or `null` if it's not a reply.
	 */
	get parentMessageText(): string | null {
		return this._tags.get('reply-parent-msg-body') ?? null;
	}

	/**
	 * The ID of the user that wrote the message that this message is a reply to, or `null` if it's not a reply.
	 */
	get parentMessageUserId(): string | null {
		return this._tags.get('reply-parent-user-id') ?? null;
	}

	/**
	 * The name of the user that wrote the message that this message is a reply to, or `null` if it's not a reply.
	 */
	get parentMessageUserName(): string | null {
		return this._tags.get('reply-parent-user-login') ?? null;
	}

	/**
	 * The display name of the user that wrote the message that this message is a reply to, or `null` if it's not a reply.
	 */
	get parentMessageUserDisplayName(): string | null {
		return this._tags.get('reply-parent-display-name') ?? null;
	}

	/**
	 * The ID of the message that is the thread starter of this message, or `null` if it's not a reply.
	 */
	get threadMessageId(): string | null {
		return this._tags.get('reply-thread-parent-msg-id') ?? null;
	}

	/**
	 * The ID of the user that wrote the thread starter message of this message, or `null` if it's not a reply.
	 */
	get threadMessageUserId(): string | null {
		return this._tags.get('reply-thread-parent-user-id') ?? null;
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
	 * Whether the message is a Hype Chat.
	 */
	get isHypeChat(): boolean {
		return this._tags.has('pinned-chat-paid-amount');
	}

	/**
	 * The amount of money that was sent for Hype Chat, specified in the currency’s minor unit,
	 * or `null` if the message is not a Hype Chat.
	 *
	 * For example, the minor units for USD is cents, so if the amount is $5.50 USD, `value` is set to 550.
	 */
	get hypeChatAmount(): number | null {
		return mapNullable(this._tags.get('pinned-chat-paid-amount'), Number);
	}

	/**
	 * The number of decimal places used by the currency used for Hype Chat,
	 * or `null` if the message is not a Hype Chat.
	 *
	 * For example, USD uses two decimal places.
	 * Use this number to translate `hypeChatAmount` from minor units to major units by using the formula:
	 *
	 * `value / 10^decimalPlaces`
	 */
	get hypeChatDecimalPlaces(): number | null {
		return mapNullable(this._tags.get('pinned-chat-paid-exponent'), Number);
	}

	/**
	 * The localized amount of money sent for Hype Chat, based on the value and the decimal places of the currency,
	 * or `null` if the message is not a Hype Chat.
	 *
	 * For example, the minor units for USD is cents which uses two decimal places,
	 * so if `value` is 550, `localizedValue` is set to 5.50.
	 */
	get hypeChatLocalizedAmount(): number | null {
		const amount = this.hypeChatAmount;
		if (!amount) {
			return null;
		}
		return amount / 10 ** this.hypeChatDecimalPlaces!;
	}

	/**
	 * The ISO-4217 three-letter currency code that identifies the currency used for Hype Chat,
	 * or `null` if the message is not a Hype Chat.
	 */
	get hypeChatCurrency(): string | null {
		return this._tags.get('pinned-chat-paid-currency') ?? null;
	}

	/**
	 * The level of the Hype Chat, or `null` if the message is not a Hype Chat.
	 */
	get hypeChatLevel(): number | null {
		const levelString = this._tags.get('pinned-chat-paid-level');
		if (!levelString) {
			return null;
		}
		return HYPE_CHAT_LEVELS.indexOf(levelString) + 1;
	}

	/**
	 * Whether the system filled in the message for the Hype Chat (because the user didn't type one),
	 * or `null` if the message is not a Hype Chat.
	 */
	get hypeChatIsSystemMessage(): boolean | null {
		const flagString = this._tags.get('pinned-chat-paid-is-system-message');
		if (!flagString) {
			return null;
		}

		return Boolean(Number(flagString));
	}
}
