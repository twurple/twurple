import { mapNullable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent';
import {
	type EventSubChannelChatNotificationSubTier,
	type EventSubChannelChatSharedChatResubNotificationEventData,
} from './EventSubChannelChatNotificationEvent.external';

/**
 * An EventSub event representing a resub notification in another channel's chat during a shared chat session.
 */
@rtfm<EventSubChannelChatSharedChatResubNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatSharedChatResubNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatSharedChatResubNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatSharedChatResubNotificationEventData;

	readonly type = 'shared_chat_resub' as const;

	/**
	 * The tier of the subscription.
	 */
	get tier(): EventSubChannelChatNotificationSubTier {
		return this[rawDataSymbol].shared_chat_resub.sub_tier;
	}

	/**
	 * Whether the subscription was "paid" for using Prime Gaming.
	 */
	get isPrime(): boolean {
		return this[rawDataSymbol].shared_chat_resub.is_prime;
	}

	/**
	 * The number of months the subscription is for.
	 */
	get durationMonths(): number {
		return this[rawDataSymbol].shared_chat_resub.duration_months || 1;
	}

	/**
	 * The total number of months the user has subscribed for.
	 */
	get cumulativeMonths(): number {
		return this[rawDataSymbol].shared_chat_resub.cumulative_months;
	}

	/**
	 * The streak amount of months the user has been subscribed for, or `null` if not shared.
	 */
	get streakMonths(): number | null {
		return this[rawDataSymbol].shared_chat_resub.streak_months ?? null;
	}

	/**
	 * Whether the resub was gifted by another user.
	 */
	get isGift(): boolean {
		return this[rawDataSymbol].shared_chat_resub.is_gift;
	}

	/**
	 * Whether the gifter is anonymous, or `null` if this is not a gift.
	 */
	get isGifterAnonymous(): boolean | null {
		return this[rawDataSymbol].shared_chat_resub.gifter_is_anonymous ?? null;
	}

	/**
	 * The ID of the gifter, or `null` if they're anonymous or this is not a gift.
	 */
	get gifterId(): string | null {
		return this[rawDataSymbol].shared_chat_resub.gifter_user_id;
	}

	/**
	 * The username of the gifter, or `null` if they're anonymous or this is not a gift.
	 */
	get gifterName(): string | null {
		return this[rawDataSymbol].shared_chat_resub.gifter_user_login;
	}

	/**
	 * The display name of the gifter, or `null` if they're anonymous or this is not a gift.
	 */
	get gifterDisplayName(): string | null {
		return this[rawDataSymbol].shared_chat_resub.gifter_user_name;
	}

	/**
	 * Gets more information about the gifter, or `null` if they're anonymous or this is not a gift.
	 */
	async getGifter(): Promise<HelixUser | null> {
		return await mapNullable(
			this[rawDataSymbol].shared_chat_resub.gifter_user_id,
			async id => await this._client.users.getUserById(id),
		);
	}
}
