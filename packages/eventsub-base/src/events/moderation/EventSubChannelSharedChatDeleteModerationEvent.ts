import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';
import { type EventSubChannelSharedChatDeleteModerationEventData } from './EventSubChannelModerationEvent.external';
import { type HelixUser } from '@twurple/api';

/**
 * An EventSub event representing a moderator deleting a message in another channel during a shared chat session.
 */
@rtfm<EventSubChannelSharedChatDeleteModerationEvent>(
	'eventsub-base',
	'EventSubChannelSharedChatDeleteModerationEvent',
	'broadcasterId',
)
export class EventSubChannelSharedChatDeleteModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelSharedChatDeleteModerationEventData;

	override readonly moderationAction = 'shared_chat_delete';

	/**
	 * The ID of the user whose message is being deleted.
	 */
	get userId(): string {
		return this[rawDataSymbol].shared_chat_delete.user_id;
	}

	/**
	 * The name of the user whose message is being deleted.
	 */
	get userName(): string {
		return this[rawDataSymbol].shared_chat_delete.user_login;
	}

	/**
	 * The display name of the user whose message is being deleted.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].shared_chat_delete.user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].shared_chat_delete.user_id);
	}

	/**
	 * The ID of the message being deleted.
	 */
	get messageId(): string {
		return this[rawDataSymbol].shared_chat_delete.message_id;
	}

	/**
	 * The message text of the message being deleted.
	 */
	get messageText(): string {
		return this[rawDataSymbol].shared_chat_delete.message_body;
	}
}
