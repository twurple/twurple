import type { HelixUser } from '@twurple/api';
import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent.js';
import { type EventSubChannelSharedChatBanModerationEventData } from './EventSubChannelModerationEvent.external.js';

/**
 * An EventSub event representing a moderator banning a user in another channel during a shared chat session.
 */
@rtfm<EventSubChannelSharedChatBanModerationEvent>(
	'eventsub-base',
	'EventSubChannelSharedChatBanModerationEvent',
	'broadcasterId',
)
export class EventSubChannelSharedChatBanModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelSharedChatBanModerationEventData;

	override readonly moderationAction = 'shared_chat_ban' as const;

	/**
	 * The ID of the user being banned.
	 */
	get userId(): string {
		return this[rawDataSymbol].shared_chat_ban.user_id;
	}

	/**
	 * The name of the user being banned.
	 */
	get userName(): string {
		return this[rawDataSymbol].shared_chat_ban.user_login;
	}

	/**
	 * The display name of the user being banned.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].shared_chat_ban.user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].shared_chat_ban.user_id);
	}

	/**
	 * The reason given for the ban.
	 */
	get reason(): string {
		return this[rawDataSymbol].shared_chat_ban.reason;
	}
}
