import type { HelixUser } from '@twurple/api';
import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';
import { type EventSubChannelSharedChatUnbanModerationEventData } from './EventSubChannelModerationEvent.external';

/**
 * An EventSub event representing a moderator unbanning a user in another channel during a shared chat session.
 */
@rtfm<EventSubChannelSharedChatUnbanModerationEvent>(
	'eventsub-base',
	'EventSubChannelSharedChatUnbanModerationEvent',
	'broadcasterId',
)
export class EventSubChannelSharedChatUnbanModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelSharedChatUnbanModerationEventData;

	override readonly moderationAction = 'shared_chat_unban' as const;

	/**
	 * The ID of the user being unbanned.
	 */
	get userId(): string {
		return this[rawDataSymbol].shared_chat_unban.user_id;
	}

	/**
	 * The name of the user being unbanned.
	 */
	get userName(): string {
		return this[rawDataSymbol].shared_chat_unban.user_login;
	}

	/**
	 * The display name of the user being unbanned.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].shared_chat_unban.user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].shared_chat_unban.user_id);
	}
}
