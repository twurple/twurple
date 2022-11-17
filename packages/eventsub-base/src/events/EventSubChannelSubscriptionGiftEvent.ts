import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/**
 * The tier of a gifted subscription. 1000 means tier 1, and so on.
 */
export type EventSubChannelSubscriptionGiftEventTier = '1000' | '2000' | '3000';

/** @private */
export interface EventSubChannelSubscriptionGiftEventData {
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	total: number;
	tier: EventSubChannelSubscriptionGiftEventTier;
	cumulative_total: number | null;
	is_anonymous: boolean;
}

/**
 * An EventSub event representing a channel subscription.
 */
@rtfm<EventSubChannelSubscriptionGiftEvent>('eventsub-base', 'EventSubChannelSubscriptionGiftEvent', 'gifterId')
export class EventSubChannelSubscriptionGiftEvent extends DataObject<EventSubChannelSubscriptionGiftEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelSubscriptionGiftEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the gifting user.
	 */
	get gifterId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the gifting user.
	 */
	get gifterName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the gifting user.
	 */
	get gifterDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Retrieves more information about the gifting user.
	 */
	async getGifter(): Promise<HelixUser> {
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
	 * The amount of gifts that were gifted.
	 */
	get amount(): number {
		return this[rawDataSymbol].total;
	}

	/**
	 * The amount of gifts that the gifter has sent in total, or `null` the gift is anonymous.
	 */
	get cumulativeAmount(): number | null {
		return this[rawDataSymbol].cumulative_total;
	}

	/**
	 * The tier of the subscription, either 1000, 2000 or 3000.
	 */
	get tier(): EventSubChannelSubscriptionGiftEventTier {
		return this[rawDataSymbol].tier;
	}

	/**
	 * Whether the gift is anonymous.
	 */
	get isAnonymous(): boolean {
		return this[rawDataSymbol].is_anonymous;
	}
}
