import { type HelixUser } from '@twurple/api';
import { checkRelationAssertion, rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent';
import {
	type EventSubChannelChatNotificationSubTier,
	type EventSubChannelChatSharedChatSubGiftNotificationEventData,
} from './EventSubChannelChatNotificationEvent.external';

/**
 * An EventSub event representing a sub gift notification in another channel's chat during a shared chat session.
 */
@rtfm<EventSubChannelChatSharedChatSubGiftNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatSharedChatSubGiftNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatSharedChatSubGiftNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatSharedChatSubGiftNotificationEventData;

	readonly type = 'shared_chat_sub_gift';

	/**
	 * The tier of the subscription.
	 */
	get tier(): EventSubChannelChatNotificationSubTier {
		return this[rawDataSymbol].shared_chat_sub_gift.sub_tier;
	}

	/**
	 * The number of months the subscription is for.
	 */
	get durationMonths(): number {
		return this[rawDataSymbol].shared_chat_sub_gift.duration_months || 1;
	}

	/**
	 * The amount of gifts that the gifter has sent in total, or `null` the gift is anonymous.
	 */
	get cumulativeAmount(): number | null {
		return this[rawDataSymbol].shared_chat_sub_gift.cumulative_total;
	}

	/**
	 * The ID of the recipient.
	 */
	get recipientId(): string {
		return this[rawDataSymbol].shared_chat_sub_gift.recipient_user_id;
	}

	/**
	 * The username of the recipient.
	 */
	get recipientName(): string {
		return this[rawDataSymbol].shared_chat_sub_gift.recipient_user_login;
	}

	/**
	 * The display name of the recipient.
	 */
	get recipientDisplayName(): string {
		return this[rawDataSymbol].shared_chat_sub_gift.recipient_user_name;
	}

	/**
	 * Gets more information about the recipient.
	 */
	async getRecipient(): Promise<HelixUser> {
		return checkRelationAssertion(
			await this._client.users.getUserById(this[rawDataSymbol].shared_chat_sub_gift.recipient_user_id),
		);
	}

	/**
	 * The id of the community gift the sub gift belongs to, or `null` if it doesn't belong to any community gift.
	 */
	get communityGiftId(): string | null {
		return this[rawDataSymbol].shared_chat_sub_gift.community_gift_id;
	}
}
