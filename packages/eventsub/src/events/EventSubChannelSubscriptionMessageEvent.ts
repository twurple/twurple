import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';
import { rtfm } from 'twitch-common';

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
@rtfm<EventSubChannelSubscriptionMessageEvent>('twitch-eventsub', 'EventSubChannelSubscriptionMessageEvent', 'userId')
export class EventSubChannelSubscriptionMessageEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubChannelSubscriptionMessageEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the user whose subscription is being announced.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The name of the user whose subscription is being announced.
	 */
	get userName(): string {
		return this._data.user_login;
	}

	/**
	 * The display name of the user whose subscription is being announced.
	 */
	get userDisplayName(): string {
		return this._data.user_name;
	}

	/**
	 * Retrieves more information about the user whose subscription is being announced.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.user_id))!;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this._data.broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this._data.broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this._data.broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.broadcaster_user_id))!;
	}

	/**
	 * The tier of the subscription, either 1000, 2000 or 3000.
	 */
	get tier(): EventSubChannelSubscriptionMessageEventTier {
		return this._data.tier;
	}

	/**
	 * The total number of months the user has been subscribed.
	 */
	get cumulativeMonths(): number {
		return this._data.cumulative_months;
	}

	/**
	 * The number of months the user has been subscribed in a row, or null if they don't want to share it.
	 */
	get streakMonths(): number | null {
		return this._data.streak_months;
	}

	/**
	 * The number of months the user has now subscribed.
	 */
	get durationMonths(): number {
		return this._data.duration_months;
	}

	/**
	 * The text of the message.
	 */
	get messageText(): string {
		return this._data.message.text;
	}
}
