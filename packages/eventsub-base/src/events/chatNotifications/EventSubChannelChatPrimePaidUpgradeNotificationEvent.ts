import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent';
import {
	type EventSubChannelChatNotificationSubTier,
	type EventSubChannelChatPrimePaidUpgradeNotificationEventData,
} from './EventSubChannelChatNotificationEvent.external';

/**
 * An EventSub event representing a notification of a user upgrading their gifted sub to a paid one in a channel's chat.
 */
@rtfm<EventSubChannelChatPrimePaidUpgradeNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatPrimePaidUpgradeNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatPrimePaidUpgradeNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatPrimePaidUpgradeNotificationEventData;

	readonly type = 'prime_paid_upgrade';

	get tier(): EventSubChannelChatNotificationSubTier {
		return this[rawDataSymbol].prime_paid_upgrade.sub_tier;
	}
}
