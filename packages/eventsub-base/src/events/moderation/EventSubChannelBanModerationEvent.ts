import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';
import { type EventSubChannelBanModerationEventData } from './EventSubChannelModerationEvent.external';
import type { HelixUser } from '@twurple/api';

/**
 * An EventSub event representing a moderator banning a user on a channel.
 */
@rtfm<EventSubChannelBanModerationEvent>('eventsub-base', 'EventSubChannelBanModerationEvent', 'broadcasterId')
export class EventSubChannelBanModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelBanModerationEventData;

	override readonly moderationAction = 'ban';

	/**
	 * The ID of the user being banned.
	 */
	get userId(): string {
		return this[rawDataSymbol].ban.user_id;
	}

	/**
	 * The name of the user being banned.
	 */
	get userName(): string {
		return this[rawDataSymbol].ban.user_login;
	}

	/**
	 * The display name of the user being banned.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].ban.user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].ban.user_id);
	}

	/**
	 * The reason given for the ban.
	 */
	get reason(): string {
		return this[rawDataSymbol].ban.reason;
	}
}
