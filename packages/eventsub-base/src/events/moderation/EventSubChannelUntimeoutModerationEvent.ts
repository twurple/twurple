import type { HelixUser } from '@twurple/api';
import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';
import { type EventSubChannelUntimeoutModerationEventData } from './EventSubChannelModerationEvent.external';

/**
 * An EventSub event representing a moderator removing a timeout from a user on a channel.
 */
@rtfm<EventSubChannelUntimeoutModerationEvent>(
	'eventsub-base',
	'EventSubChannelUntimeoutModerationEvent',
	'broadcasterId',
)
export class EventSubChannelUntimeoutModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelUntimeoutModerationEventData;

	override readonly moderationAction = 'untimeout' as const;

	/**
	 * The ID of the user being untimed out.
	 */
	get userId(): string {
		return this[rawDataSymbol].untimeout.user_id;
	}

	/**
	 * The name of the user being untimed out.
	 */
	get userName(): string {
		return this[rawDataSymbol].untimeout.user_login;
	}

	/**
	 * The display name of the user being untimed out.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].untimeout.user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].untimeout.user_id);
	}
}
