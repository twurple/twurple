import { mapNullable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent.js';
import {
	type EventSubChannelChatNotificationSubTier,
	type EventSubChannelChatResubNotificationEventData,
} from './EventSubChannelChatNotificationEvent.external.js';

/**
 * An EventSub event representing a resub notification in a channel's chat.
 */
@rtfm<EventSubChannelChatResubNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatSubNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatResubNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatResubNotificationEventData;

	readonly type = 'resub' as const;

	/**
	 * The tier of the subscription.
	 */
	get tier(): EventSubChannelChatNotificationSubTier {
		return this[rawDataSymbol].resub.sub_tier;
	}

	/**
	 * Whether the subscription was "paid" for using Prime Gaming.
	 */
	get isPrime(): boolean {
		return this[rawDataSymbol].resub.is_prime;
	}

	/**
	 * The number of months the subscription is for.
	 */
	get durationMonths(): number {
		return this[rawDataSymbol].resub.duration_months || 1;
	}

	/**
	 * The total number of months the user has subscribed for.
	 */
	get cumulativeMonths(): number {
		return this[rawDataSymbol].resub.cumulative_months;
	}

	/**
	 * The streak amount of months the user has been subscribed for, or `null` if not shared.
	 */
	get streakMonths(): number | null {
		return this[rawDataSymbol].resub.streak_months ?? null;
	}

	/**
	 * Whether the resub was gifted by another user.
	 */
	get isGift(): boolean {
		return this[rawDataSymbol].resub.is_gift;
	}

	/**
	 * Whether the gifter is anonymous, or `null` if this is not a gift.
	 */
	get isGifterAnonymous(): boolean | null {
		return this[rawDataSymbol].resub.gifter_is_anonymous ?? null;
	}

	/**
	 * The ID of the gifter, or `null` if they're anonymous or this is not a gift.
	 */
	get gifterId(): string | null {
		return this[rawDataSymbol].resub.gifter_user_id;
	}

	/**
	 * The username of the gifter, or `null` if they're anonymous or this is not a gift.
	 */
	get gifterName(): string | null {
		return this[rawDataSymbol].resub.gifter_user_login;
	}

	/**
	 * The display name of the gifter, or `null` if they're anonymous or this is not a gift.
	 */
	get gifterDisplayName(): string | null {
		return this[rawDataSymbol].resub.gifter_user_name;
	}

	/**
	 * Gets more information about the gifter, or `null` if they're anonymous or this is not a gift.
	 */
	async getGifter(): Promise<HelixUser | null> {
		return await mapNullable(
			this[rawDataSymbol].resub.gifter_user_id,
			async id => await this._client.users.getUserById(id),
		);
	}
}
