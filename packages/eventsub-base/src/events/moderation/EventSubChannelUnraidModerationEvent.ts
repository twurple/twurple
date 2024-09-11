import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';
import { type EventSubChannelUnraidModerationEventData } from './EventSubChannelModerationEvent.external';
import type { HelixUser } from '@twurple/api';

/**
 * An EventSub event representing a moderator canceling the raid on a channel.
 */
@rtfm<EventSubChannelUnraidModerationEvent>('eventsub-base', 'EventSubChannelUnraidModerationEvent', 'broadcasterId')
export class EventSubChannelUnraidModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelUnraidModerationEventData;

	override readonly moderationAction = 'unraid';

	/**
	 * The ID of the user no longer being raided.
	 */
	get userId(): string {
		return this[rawDataSymbol].unraid.user_id;
	}

	/**
	 * The name of the user no longer being raided.
	 */
	get userName(): string {
		return this[rawDataSymbol].unraid.user_login;
	}

	/**
	 * The display name of the user no longer being raided.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].unraid.user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].unraid.user_id);
	}
}
