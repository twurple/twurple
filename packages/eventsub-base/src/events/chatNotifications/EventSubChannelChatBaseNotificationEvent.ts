import { Enumerable } from '@d-fischer/shared-utils';
import { type ApiClient, type HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubChatMessagePart } from '../common/EventSubChatMessage.external.js';
import {
	type EventSubChannelChatBaseNotificationEventData,
	type EventSubChannelChatNotificationType,
} from './EventSubChannelChatNotificationEvent.external.js';

/**
 * An EventSub event representing a notification being sent to a channel's chat.
 */
@rtfm<EventSubChannelChatBaseNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatBaseNotificationEvent',
	'broadcasterId',
)
export abstract class EventSubChannelChatBaseNotificationEvent extends DataObject<EventSubChannelChatBaseNotificationEventData> {
	/** @internal */ @Enumerable(false) protected readonly _client: ApiClient;

	/**
	 * The type of the notification.
	 */
	abstract readonly type: EventSubChannelChatNotificationType;

	/** @internal */
	constructor(data: EventSubChannelChatBaseNotificationEventData, client: ApiClient) {
		super(data);
		this._client = client;
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
	 * Whether the chatter is anonymous.
	 *
	 * Only applies to some event types like sub gifts.
	 */
	get chatterIsAnonymous(): boolean {
		return this[rawDataSymbol].chatter_is_anonymous;
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
	 * The ID of the broadcaster from whose channel the message was sent.
	 *
	 * This only applies if a chatter sends a chat message in another channel's chat during a shared chat session.
	 * Is `null` when the message notification happens in the same channel as the broadcaster.
	 */
	get sourceBroadcasterId(): string | null {
		return this[rawDataSymbol].source_broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster from whose channel the message was sent.
	 *
	 * This only applies if a chatter sends a chat message in another channel's chat during a shared chat session.
	 * Is `null` when the message notification happens in the same channel as the broadcaster.
	 */
	get sourceBroadcasterName(): string | null {
		return this[rawDataSymbol].source_broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster from whose channel the message was sent.
	 *
	 * This only applies if a chatter sends a chat message in another channel's chat during a shared chat session.
	 * Is `null` when the message notification happens in the same channel as the broadcaster.
	 */
	get sourceBroadcasterDisplayName(): string | null {
		return this[rawDataSymbol].source_broadcaster_user_name;
	}

	/**
	 * The UUID that identifies the source message from the channel the message was sent.
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
