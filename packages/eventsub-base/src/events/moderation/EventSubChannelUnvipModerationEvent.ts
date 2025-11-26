import type { HelixUser } from '@twurple/api';
import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent.js';
import { type EventSubChannelUnvipModerationEventData } from './EventSubChannelModerationEvent.external.js';

/**
 * An EventSub event representing a user having lost VIP status on a channel.
 */
@rtfm<EventSubChannelUnvipModerationEvent>('eventsub-base', 'EventSubChannelUnvipModerationEvent', 'broadcasterId')
export class EventSubChannelUnvipModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelUnvipModerationEventData;

	override readonly moderationAction = 'unvip' as const;

	/**
	 * The ID of the user losing VIP status.
	 */
	get userId(): string {
		return this[rawDataSymbol].unvip.user_id;
	}

	/**
	 * The name of the user losing VIP status.
	 */
	get userName(): string {
		return this[rawDataSymbol].unvip.user_login;
	}

	/**
	 * The display name of the user losing VIP status.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].unvip.user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].unvip.user_id);
	}
}
