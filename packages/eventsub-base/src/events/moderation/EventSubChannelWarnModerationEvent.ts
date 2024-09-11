import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';
import { type EventSubChannelWarnModerationEventData } from './EventSubChannelModerationEvent.external';
import type { HelixUser } from '@twurple/api';

/**
 * An EventSub event representing a moderator warning a user in a channel.
 */
@rtfm<EventSubChannelWarnModerationEvent>('eventsub-base', 'EventSubChannelWarnModerationEvent', 'broadcasterId')
export class EventSubChannelWarnModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelWarnModerationEventData;

	override readonly moderationAction = 'warn';

	/**
	 * The ID of the user being warned.
	 */
	get userId(): string {
		return this[rawDataSymbol].warn.user_id;
	}

	/**
	 * The name of the user being warned.
	 */
	get userName(): string {
		return this[rawDataSymbol].warn.user_login;
	}

	/**
	 * The display name of the user being warned.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].warn.user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].warn.user_id);
	}

	/**
	 * The reason given for the warning, or `null` if no reason was specified.
	 */
	get reason(): string | null {
		return this[rawDataSymbol].warn.reason;
	}

	/**
	 * The chat rules cited for the warning. This will be an empty array if no rules are cited.
	 */
	get chatRulesCited(): string[] {
		return this[rawDataSymbol].warn.chat_rules_cited ?? [];
	}
}
