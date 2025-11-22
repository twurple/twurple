import type { HelixUser } from '@twurple/api';
import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';
import { type EventSubChannelSharedChatTimeoutModerationEventData } from './EventSubChannelModerationEvent.external';

/**
 * An EventSub event representing a moderator timing out a user in another channel during a shared chat session.
 */
@rtfm<EventSubChannelSharedChatTimeoutModerationEvent>(
	'eventsub-base',
	'EventSubChannelSharedChatTimeoutModerationEvent',
	'broadcasterId',
)
export class EventSubChannelSharedChatTimeoutModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelSharedChatTimeoutModerationEventData;

	override readonly moderationAction = 'shared_chat_timeout' as const;

	/**
	 * The ID of the user being timed out.
	 */
	get userId(): string {
		return this[rawDataSymbol].shared_chat_timeout.user_id;
	}

	/**
	 * The name of the user being timed out.
	 */
	get userName(): string {
		return this[rawDataSymbol].shared_chat_timeout.user_login;
	}

	/**
	 * The display name of the user being timed out.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].shared_chat_timeout.user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].shared_chat_timeout.user_id);
	}

	/**
	 * The reason given for the timeout.
	 */
	get reason(): string {
		return this[rawDataSymbol].shared_chat_timeout.reason;
	}

	/**
	 * The time at which the timeout ends.
	 */
	get expiryDate(): Date {
		return new Date(this[rawDataSymbol].shared_chat_timeout.expires_at);
	}
}
