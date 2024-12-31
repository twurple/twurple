import { Enumerable } from '@d-fischer/shared-utils';
import { type ApiClient, type HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubChatMessagePart } from './common/EventSubChatMessage.external';
import { type EventSubChannelChatMessageEventData } from './EventSubChannelChatMessageEvent.external';

/**
 * An EventSub event representing a notification being sent to a channel's chat.
 */
@rtfm<EventSubChannelChatMessageEvent>('eventsub-base', 'EventSubChannelChatMessageEvent', 'broadcasterId')
export class EventSubChannelChatMessageEvent extends DataObject<EventSubChannelChatMessageEventData> {
	/** @internal */ @Enumerable(false) protected readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelChatMessageEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The type of the message.
	 */
	get messageType(): string {
		return this[rawDataSymbol].message_type;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * The ID of the chatter.
	 */
	get chatterId(): string {
		return this[rawDataSymbol].chatter_user_id;
	}

	/**
	 * The name of the chatter.
	 */
	get chatterName(): string {
		return this[rawDataSymbol].chatter_user_login;
	}

	/**
	 * The display name of the chatter.
	 */
	get chatterDisplayName(): string {
		return this[rawDataSymbol].chatter_user_name;
	}

	/**
	 * Gets more information about the chatter.
	 */
	async getChatter(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].chatter_user_id));
	}

	/**
	 * The color of the chatter, or null if they didn't choose a color.
	 */
	get color(): string | null {
		return this[rawDataSymbol].color || null;
	}

	/**
	 * The badges the chatter has.
	 *
	 * The returned object contains the badge names as keys and the badge versions as the respective values.
	 */
	get badges(): Record<string, string> {
		return Object.fromEntries(this[rawDataSymbol].badges.map(badge => [badge.set_id, badge.id]));
	}

	/**
	 * Checks whether the chatter has the specified badge.
	 *
	 * @param name The name of the badge to check.
	 */
	hasBadge(name: string): boolean {
		return this[rawDataSymbol].badges.some(badge => badge.set_id === name);
	}

	/**
	 * Gets the badge info for a specified badge, or null if the badge does not exist.
	 *
	 * @param name The name of the badge to get info for.
	 */
	getBadgeInfo(name: string): string | null {
		return this[rawDataSymbol].badges.find(badge => badge.set_id === name)?.info ?? null;
	}

	/**
	 * The ID of the notification message.
	 */
	get messageId(): string {
		return this[rawDataSymbol].message_id;
	}

	/**
	 * The text that was sent with the notification, e.g. the resub message or announcement text.
	 */
	get messageText(): string {
		return this[rawDataSymbol].message.text;
	}

	/**
	 * The text that was sent with the notification, structured into pre-parsed parts.
	 */
	get messageParts(): EventSubChatMessagePart[] {
		return this[rawDataSymbol].message.fragments;
	}

	/**
	 * The ID of the message that this message is a reply to, or `null` if it's not a reply.
	 */
	get parentMessageId(): string | null {
		return this[rawDataSymbol].reply?.parent_message_id ?? null;
	}

	/**
	 * The text of the message that this message is a reply to, or `null` if it's not a reply.
	 */
	get parentMessageText(): string | null {
		return this[rawDataSymbol].reply?.parent_message_body ?? null;
	}

	/**
	 * The ID of the user that wrote the message that this message is a reply to, or `null` if it's not a reply.
	 */
	get parentMessageUserId(): string | null {
		return this[rawDataSymbol].reply?.parent_user_id ?? null;
	}

	/**
	 * The name of the user that wrote the message that this message is a reply to, or `null` if it's not a reply.
	 */
	get parentMessageUserName(): string | null {
		return this[rawDataSymbol].reply?.parent_user_login ?? null;
	}

	/**
	 * The display name of the user that wrote the message that this message is a reply to, or `null` if it's not a reply.
	 */
	get parentMessageUserDisplayName(): string | null {
		return this[rawDataSymbol].reply?.parent_user_name ?? null;
	}

	/**
	 * The ID of the message that is the thread starter of this message, or `null` if it's not a reply.
	 */
	get threadMessageId(): string | null {
		return this[rawDataSymbol].reply?.thread_message_id ?? null;
	}

	/**
	 * The ID of the user that wrote the thread starter message of this message, or `null` if it's not a reply.
	 */
	get threadMessageUserId(): string | null {
		return this[rawDataSymbol].reply?.thread_user_id ?? null;
	}

	/**
	 * The name of the user that wrote the thread starter message of this message, or `null` if it's not a reply.
	 */
	get threadMessageUserName(): string | null {
		return this[rawDataSymbol].reply?.thread_user_login ?? null;
	}

	/**
	 * The display name of the user that wrote the thread starter message of this message, or `null` if it's not a reply.
	 */
	get threadMessageUserDisplayName(): string | null {
		return this[rawDataSymbol].reply?.thread_user_name ?? null;
	}

	/**
	 * Whether the message is a cheer.
	 */
	get isCheer(): boolean {
		return Boolean(this[rawDataSymbol].cheer);
	}

	/**
	 * The number of bits cheered with this message.
	 */
	get bits(): number {
		return this[rawDataSymbol].cheer?.bits ?? 0;
	}

	/**
	 * Whether the message represents a redemption of a custom channel points reward.
	 */
	get isRedemption(): boolean {
		return Boolean(this[rawDataSymbol].channel_points_custom_reward_id);
	}

	/**
	 * The ID of the redeemed reward, or `null` if the message does not represent a redemption.
	 */
	get rewardId(): string | null {
		return this[rawDataSymbol].channel_points_custom_reward_id ?? null;
	}

	/**
	 * The ID of the broadcaster from whose channel the message was sent.
	 *
	 * This only applies if a chatter sends a chat message in another channel's chat during a shared chat session.
	 * Is `null` when the message happens in the same channel as the broadcaster.
	 */
	get sourceBroadcasterId(): string | null {
		return this[rawDataSymbol].source_broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster from whose channel the message was sent.
	 *
	 * This only applies if a chatter sends a chat message in another channel's chat during a shared chat session.
	 * Is `null` when the message happens in the same channel as the broadcaster.
	 */
	get sourceBroadcasterName(): string | null {
		return this[rawDataSymbol].source_broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster from whose channel the message was sent.
	 *
	 * This only applies if a chatter sends a chat message in another channel's chat during a shared chat session.
	 * Is `null` when the message happens in the same channel as the broadcaster.
	 */
	get sourceBroadcasterDisplayName(): string | null {
		return this[rawDataSymbol].source_broadcaster_user_name;
	}

	/**
	 * The UUID that identifies the source message from the channel the message was sent from.
	 *
	 * This only applies if a chatter sends a chat message in another channel's chat during a shared chat session.
	 * Is `null` when the message happens in the same channel as the broadcaster.
	 */
	get sourceMessageId(): string | null {
		return this[rawDataSymbol].source_message_id;
	}

	/**
	 * The chat badges for the chatter in the channel the message was sent from.
	 *
	 * The returned object contains the badge names as keys and the badge versions as the respective values.
	 *
	 * This only applies if a chatter sends a chat message in another channel's chat during a shared chat session.
	 * Is `null` when the message happens in the same channel as the broadcaster.
	 */
	get sourceBadges(): Record<string, string> | null {
		return this[rawDataSymbol].source_badges
			? Object.fromEntries(this[rawDataSymbol].source_badges.map(badge => [badge.set_id, badge.id]))
			: null;
	}

	/**
	 * Checks whether the chatter has the specified badge.
	 *
	 * This only applies if a chatter sends a chat message to another chat during a shared chat session.
	 * Is `null` when the message happens in the same channel as the broadcaster.
	 *
	 * @param name The name of the badge to check.
	 */
	hasSourceBadge(name: string): boolean | null {
		return this[rawDataSymbol].source_badges
			? this[rawDataSymbol].source_badges.some(badge => badge.set_id === name)
			: null;
	}

	/**
	 * Gets the badge info for a specified badge.
	 *
	 * This only applies if a chatter sends a chat message in another channel's chat during a shared chat session.
	 * Is `null` when the message happens in the same channel as the broadcaster, or if the badge does not exist.
	 *
	 * @param name The name of the badge to get info for.
	 */
	getSourceBadgeInfo(name: string): string | null {
		return this[rawDataSymbol].source_badges?.find(badge => badge.set_id === name)?.info ?? null;
	}
}
