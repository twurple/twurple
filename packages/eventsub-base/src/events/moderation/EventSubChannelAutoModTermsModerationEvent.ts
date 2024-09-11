import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';
import {
	type EventSubChannelAutomodTermsModerationEventAction,
	type EventSubChannelAutoModTermsModerationEventData,
	type EventSubChannelAutomodTermsModerationEventList,
	type EventSubChannelBaseModerationEventData,
	type EventSubChannelModerationAction,
} from './EventSubChannelModerationEvent.external';
import { type ApiClient } from '@twurple/api';

/**
 * An EventSub event representing a moderator managing AutoMod terms on a channel.
 */
@rtfm<EventSubChannelAutoModTermsModerationEvent>(
	'eventsub-base',
	'EventSubChannelAutoModTermsModerationEvent',
	'broadcasterId',
)
export class EventSubChannelAutoModTermsModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelAutoModTermsModerationEventData;

	override readonly moderationAction: Extract<
		EventSubChannelModerationAction,
		'add_blocked_term' | 'add_permitted_term' | 'remove_blocked_term' | 'remove_permitted_term'
	>;

	/** @internal */
	constructor(
		data: EventSubChannelBaseModerationEventData,
		action: Extract<
			EventSubChannelModerationAction,
			'add_blocked_term' | 'add_permitted_term' | 'remove_blocked_term' | 'remove_permitted_term'
		>,
		client: ApiClient,
	) {
		super(data, client);
		this.moderationAction = action;
	}

	/**
	 * Whether the terms were added or removed.
	 */
	get action(): EventSubChannelAutomodTermsModerationEventAction {
		return this[rawDataSymbol].automod_terms.action;
	}

	/**
	 * Whether the terms are blocked or permitted.
	 */
	get list(): EventSubChannelAutomodTermsModerationEventList {
		return this[rawDataSymbol].automod_terms.list;
	}

	/**
	 * The list of terms being added or removed.
	 */
	get terms(): string[] {
		return this[rawDataSymbol].automod_terms.terms;
	}

	/**
	 * Whether the terms were added/removed due to an Automod resolution action.
	 */
	get fromAutoMod(): boolean {
		return this[rawDataSymbol].automod_terms.from_automod;
	}
}
