import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';
import { type EventSubChannelModModerationEventData } from './EventSubChannelModerationEvent.external';

/**
 * An EventSub event representing a user having gained moderator status on a channel.
 */
@rtfm<EventSubChannelModModerationEvent>('eventsub-base', 'EventSubChannelModModerationEvent', 'broadcasterId')
export class EventSubChannelModModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelModModerationEventData;

	override readonly moderationAction = 'mod';

	/**
	 * The ID of the user gaining mod status.
	 */
	get userId(): string {
		return this[rawDataSymbol].mod.user_id;
	}

	/**
	 * The name of the user gaining mod status.
	 */
	get userName(): string {
		return this[rawDataSymbol].mod.user_login;
	}

	/**
	 * The display name of the user gaining mod status.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].mod.user_name;
	}
}
