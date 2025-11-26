import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelCharityAmount } from '../common/EventSubChannelCharityAmount.js';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent.js';
import { type EventSubChannelChatCharityDonationNotificationEventData } from './EventSubChannelChatNotificationEvent.external.js';

/**
 * An EventSub event representing a notification for a charity donation in a channel's chat.
 */
@rtfm<EventSubChannelChatCharityDonationNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatCharityDonationNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatCharityDonationNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatCharityDonationNotificationEventData;

	readonly type = 'charity_donation' as const;

	/**
	 * The name of the charity that was donated to.
	 */
	get charityName(): string {
		return this[rawDataSymbol].charity_donation.charity_name;
	}

	/**
	 * The amount of money that was donated.
	 */
	get amount(): EventSubChannelCharityAmount {
		return new EventSubChannelCharityAmount(this[rawDataSymbol].charity_donation.amount);
	}
}
