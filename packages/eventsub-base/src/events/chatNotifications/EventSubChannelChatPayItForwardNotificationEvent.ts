import { mapNullable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent.js';
import { type EventSubChannelChatPayItForwardNotificationEventData } from './EventSubChannelChatNotificationEvent.external.js';

/**
 * An EventSub event representing a notification of a user "paying it forward" in a channel's chat.
 */
@rtfm<EventSubChannelChatPayItForwardNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatPayItForwardNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatPayItForwardNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatPayItForwardNotificationEventData;

	readonly type = 'pay_it_forward' as const;

	/**
	 * Whether the original gifter is anonymous.
	 */
	get isGifterAnonymous(): boolean {
		return this[rawDataSymbol].pay_it_forward.gifter_is_anonymous;
	}

	/**
	 * The ID of the original gifter, or `null` if they're anonymous.
	 */
	get gifterId(): string | null {
		return this[rawDataSymbol].pay_it_forward.gifter_user_id;
	}

	/**
	 * The username of the original gifter, or `null` if they're anonymous.
	 */
	get gifterName(): string | null {
		return this[rawDataSymbol].pay_it_forward.gifter_user_login;
	}

	/**
	 * The display name of the original gifter, or `null` if they're anonymous.
	 */
	get gifterDisplayName(): string | null {
		return this[rawDataSymbol].pay_it_forward.gifter_user_name;
	}

	/**
	 * Gets more information about the original gifter, or `null` if they're anonymous.
	 */
	async getGifter(): Promise<HelixUser | null> {
		return await mapNullable(
			this[rawDataSymbol].pay_it_forward.gifter_user_id,
			async id => await this._client.users.getUserById(id),
		);
	}
}
