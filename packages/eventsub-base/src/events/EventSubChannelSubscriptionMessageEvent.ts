import { Enumerable, groupBy } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import type { ParsedMessagePart } from '@twurple/common';
import { checkRelationAssertion, DataObject, parseChatMessage, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type EventSubChannelSubscriptionMessageEventData,
	type EventSubChannelSubscriptionMessageEventTier
} from './EventSubChannelSubscriptionMessageEvent.external';

/**
 * An EventSub event representing the public announcement of a channel subscription by the subscriber.
 */
@rtfm<EventSubChannelSubscriptionMessageEvent>('eventsub-base', 'EventSubChannelSubscriptionMessageEvent', 'userId')
export class EventSubChannelSubscriptionMessageEvent extends DataObject<EventSubChannelSubscriptionMessageEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelSubscriptionMessageEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the user whose subscription is being announced.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user whose subscription is being announced.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user whose subscription is being announced.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets more information about the user whose subscription is being announced.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * The tier of the subscription, either 1000, 2000 or 3000.
	 */
	get tier(): EventSubChannelSubscriptionMessageEventTier {
		return this[rawDataSymbol].tier;
	}

	/**
	 * The total number of months the user has been subscribed.
	 */
	get cumulativeMonths(): number {
		return this[rawDataSymbol].cumulative_months;
	}

	/**
	 * The number of months the user has been subscribed in a row, or null if they don't want to share it.
	 */
	get streakMonths(): number | null {
		return this[rawDataSymbol].streak_months;
	}

	/**
	 * The number of months the user has now subscribed.
	 */
	get durationMonths(): number {
		return this[rawDataSymbol].duration_months;
	}

	/**
	 * The text of the message.
	 */
	get messageText(): string {
		return this[rawDataSymbol].message.text;
	}

	/**
	 * Parses the message to split emotes from text.
	 */
	parseEmotes(): ParsedMessagePart[] {
		const messageText = this[rawDataSymbol].message.text;
		const emoteOffsets = new Map<string, string[]>(
			Object.entries(groupBy(this[rawDataSymbol].message.emotes, 'id')).map(([id, ranges]) => [
				id,
				ranges.map(({ begin, end }) => `${begin}-${end}`)
			])
		);

		return parseChatMessage(messageText, emoteOffsets) as ParsedMessagePart[];
	}
}
