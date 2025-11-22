import type { HelixUser } from '@twurple/api';
import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';
import { type EventSubChannelUnbanModerationEventData } from './EventSubChannelModerationEvent.external';

/**
 * An EventSub event representing a moderator unbanning a user on a channel.
 */
@rtfm<EventSubChannelUnbanModerationEvent>('eventsub-base', 'EventSubChannelUnbanModerationEvent', 'broadcasterId')
export class EventSubChannelUnbanModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelUnbanModerationEventData;

	override readonly moderationAction = 'unban' as const;

	/**
	 * The ID of the user being unbanned.
	 */
	get userId(): string {
		return this[rawDataSymbol].unban.user_id;
	}

	/**
	 * The name of the user being unbanned.
	 */
	get userName(): string {
		return this[rawDataSymbol].unban.user_login;
	}

	/**
	 * The display name of the user being unbanned.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].unban.user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].unban.user_id);
	}
}
