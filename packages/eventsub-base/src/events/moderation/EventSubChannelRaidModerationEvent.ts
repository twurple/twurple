import type { HelixUser } from '@twurple/api';
import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent.js';
import { type EventSubChannelRaidModerationEventData } from './EventSubChannelModerationEvent.external.js';

/**
 * An EventSub event representing a moderator starting a raid on a channel.
 */
@rtfm<EventSubChannelRaidModerationEvent>('eventsub-base', 'EventSubChannelRaidModerationEvent', 'broadcasterId')
export class EventSubChannelRaidModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelRaidModerationEventData;

	override readonly moderationAction = 'raid' as const;

	/**
	 * The ID of the user being raided.
	 */
	get userId(): string {
		return this[rawDataSymbol].raid.user_id;
	}

	/**
	 * The name of the user being raided.
	 */
	get userName(): string {
		return this[rawDataSymbol].raid.user_login;
	}

	/**
	 * The display name of the user being raided.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].raid.user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].raid.user_id);
	}

	/**
	 * The number of viewers who came with the raid.
	 */
	get viewerCount(): number {
		return this[rawDataSymbol].raid.viewer_count;
	}
}
