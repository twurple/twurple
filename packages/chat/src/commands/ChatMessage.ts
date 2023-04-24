import { rtfm } from '@twurple/common';
import { MessageTypes } from 'ircv3';
import { ChatUser } from '../ChatUser';
import { parseEmoteOffsets } from '../utils/emoteUtil';

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
}
