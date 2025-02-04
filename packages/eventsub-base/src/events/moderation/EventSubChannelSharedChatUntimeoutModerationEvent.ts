import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';
import { type EventSubChannelSharedChatUntimeoutModerationEventData } from './EventSubChannelModerationEvent.external';
import type { HelixUser } from '@twurple/api';

/**
 * An EventSub event representing a moderator untimming out a user in another channel during a shared chat session.
 */
@rtfm<EventSubChannelSharedChatUntimeoutModerationEvent>(
	'eventsub-base',
	'EventSubChannelSharedChatUntimeoutModerationEvent',
	'broadcasterId',
)
export class EventSubChannelSharedChatUntimeoutModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelSharedChatUntimeoutModerationEventData;

	override readonly moderationAction = 'shared_chat_untimeout';

	/**
	 * The ID of the user being untimed out.
	 */
	get userId(): string {
		return this[rawDataSymbol].shared_chat_untimeout.user_id;
	}

	/**
	 * The name of the user being untimed out.
	 */
	get userName(): string {
		return this[rawDataSymbol].shared_chat_untimeout.user_login;
	}

	/**
	 * The display name of the user being untimed out.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].shared_chat_untimeout.user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].shared_chat_untimeout.user_id);
	}
}
