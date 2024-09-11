import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';
import { type EventSubChannelUnmodModerationEventData } from './EventSubChannelModerationEvent.external';
import type { HelixUser } from '@twurple/api';

/**
 * An EventSub event representing a user having lost moderator status on a channel.
 */
@rtfm<EventSubChannelUnmodModerationEvent>('eventsub-base', 'EventSubChannelUnmodModerationEvent', 'broadcasterId')
export class EventSubChannelUnmodModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelUnmodModerationEventData;

	override readonly moderationAction = 'unmod';

	/**
	 * The ID of the user losing mod status.
	 */
	get userId(): string {
		return this[rawDataSymbol].unmod.user_id;
	}

	/**
	 * The name of the user losing mod status.
	 */
	get userName(): string {
		return this[rawDataSymbol].unmod.user_login;
	}

	/**
	 * The display name of the user losing mod status.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].unmod.user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].unmod.user_id);
	}
}
