import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';
import { type EventSubChannelVipModerationEventData } from './EventSubChannelModerationEvent.external';
import type { HelixUser } from '@twurple/api';

/**
 * An EventSub event representing a user having gained VIP status on a channel.
 */
@rtfm<EventSubChannelVipModerationEvent>('eventsub-base', 'EventSubChannelVipModerationEvent', 'broadcasterId')
export class EventSubChannelVipModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelVipModerationEventData;

	override readonly moderationAction = 'vip';

	/**
	 * The ID of the user gaining VIP status.
	 */
	get userId(): string {
		return this[rawDataSymbol].vip.user_id;
	}

	/**
	 * The name of the user gaining VIP status.
	 */
	get userName(): string {
		return this[rawDataSymbol].vip.user_login;
	}

	/**
	 * The display name of the user gaining VIP status.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].vip.user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].vip.user_id);
	}
}
