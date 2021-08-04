import { Enumerable, utf8Substring } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import type { ParsedMessageEmotePart, ParsedMessagePart } from '@twurple/common';
import { ChatEmote, DataObject, fillTextPositions, rawDataSymbol, rtfm } from '@twurple/common';

/**
 * The tier of a subscription. 1000 means tier 1, and so on.
 */
export type EventSubChannelSubscriptionMessageEventTier = '1000' | '2000' | '3000';

/** @private */
export interface EventSubChannelSubscriptionMessageEmoteData {
	begin: number;
	end: number;
	id: string;
}

/** @private */
export interface EventSubChannelSubscriptionMessageData {
	text: string;
	emotes: EventSubChannelSubscriptionMessageEmoteData[];
}

/** @private */
export interface EventSubChannelSubscriptionMessageEventData {
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	tier: EventSubChannelSubscriptionMessageEventTier;
	message: EventSubChannelSubscriptionMessageData;
	cumulative_months: number;
	streak_months: number | null;
	duration_months: number;
}

/**
 * An EventSub event representing the public announcement of a channel subscription by the subscriber.
 */
@rtfm<EventSubChannelSubscriptionMessageEvent>('eventsub', 'EventSubChannelSubscriptionMessageEvent', 'userId')
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
	 * Retrieves more information about the user whose subscription is being announced.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
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
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id))!;
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
		const emoteParts: ParsedMessageEmotePart[] = this[rawDataSymbol].message.emotes.map(
			({ begin, end, id }: EventSubChannelSubscriptionMessageEmoteData) => {
				const name = utf8Substring(messageText, begin, end + 1);

				return {
					type: 'emote',
					position: begin,
					length: end - begin + 1,
					id,
					name,
					displayInfo: new ChatEmote({
						code: name,
						id
					})
				};
			}
		);

		return fillTextPositions(messageText, emoteParts);
	}
}
