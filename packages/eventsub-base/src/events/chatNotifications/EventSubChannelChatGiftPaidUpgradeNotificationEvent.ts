import { mapNullable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent';
import { type EventSubChannelChatGiftPaidUpgradeNotificationEventData } from './EventSubChannelChatNotificationEvent.external';

/**
 * An EventSub event representing a notification of a user upgrading their gifted sub to a paid one in a channel's chat.
 */
@rtfm<EventSubChannelChatGiftPaidUpgradeNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatGiftPaidUpgradeNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatGiftPaidUpgradeNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatGiftPaidUpgradeNotificationEventData;

	readonly type = 'gift_paid_upgrade';

	/**
	 * Whether the original gifter is anonymous.
	 */
	get isGifterAnonymous(): boolean {
		return this[rawDataSymbol].gift_paid_upgrade.gifter_is_anonymous;
	}

	/**
	 * The ID of the original gifter, or `null` if they're anonymous.
	 */
	get gifterId(): string | null {
		return this[rawDataSymbol].gift_paid_upgrade.gifter_user_id;
	}

	/**
	 * The username of the original gifter, or `null` if they're anonymous.
	 */
	get gifterName(): string | null {
		return this[rawDataSymbol].gift_paid_upgrade.gifter_user_login;
	}

	/**
	 * The display name of the original gifter, or `null` if they're anonymous.
	 */
	get gifterDisplayName(): string | null {
		return this[rawDataSymbol].gift_paid_upgrade.gifter_user_name;
	}

	/**
	 * Gets more information about the original gifter, or `null` if they're anonymous.
	 */
	async getGifter(): Promise<HelixUser | null> {
		return await mapNullable(
			this[rawDataSymbol].gift_paid_upgrade.gifter_user_id,
			async id => await this._client.users.getUserById(id),
		);
	}
}
