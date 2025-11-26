import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent.js';
import {
	type EventSubChannelChatNotificationSubTier,
	type EventSubChannelChatSharedChatPrimePaidUpgradeNotificationEventData,
} from './EventSubChannelChatNotificationEvent.external.js';

/**
 * An EventSub event representing a notification of a user upgrading their gifted sub to a paid one in another channel's
 * chat during a shared chat session.
 */
@rtfm<EventSubChannelChatSharedChatPrimePaidUpgradeNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatSharedChatPrimePaidUpgradeNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatSharedChatPrimePaidUpgradeNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatSharedChatPrimePaidUpgradeNotificationEventData;

	readonly type = 'shared_chat_prime_paid_upgrade' as const;

	get tier(): EventSubChannelChatNotificationSubTier {
		return this[rawDataSymbol].shared_chat_prime_paid_upgrade.sub_tier;
	}
}
