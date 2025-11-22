import { mapNullable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent';
import { type EventSubChannelChatSharedChatPayItForwardNotificationEventData } from './EventSubChannelChatNotificationEvent.external';

/**
 * An EventSub event representing a notification of a user "paying it forward" in another channel's chat during a shared
 * chat session.
 */
@rtfm<EventSubChannelChatSharedChatPayItForwardNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatSharedChatPayItForwardNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatSharedChatPayItForwardNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatSharedChatPayItForwardNotificationEventData;

	readonly type = 'shared_chat_pay_it_forward' as const;

	/**
	 * Whether the original gifter is anonymous.
	 */
	get isGifterAnonymous(): boolean {
		return this[rawDataSymbol].shared_chat_pay_it_forward.gifter_is_anonymous;
	}

	/**
	 * The ID of the original gifter, or `null` if they're anonymous.
	 */
	get gifterId(): string | null {
		return this[rawDataSymbol].shared_chat_pay_it_forward.gifter_user_id;
	}

	/**
	 * The username of the original gifter, or `null` if they're anonymous.
	 */
	get gifterName(): string | null {
		return this[rawDataSymbol].shared_chat_pay_it_forward.gifter_user_login;
	}

	/**
	 * The display name of the original gifter, or `null` if they're anonymous.
	 */
	get gifterDisplayName(): string | null {
		return this[rawDataSymbol].shared_chat_pay_it_forward.gifter_user_name;
	}

	/**
	 * Gets more information about the original gifter, or `null` if they're anonymous.
	 */
	async getGifter(): Promise<HelixUser | null> {
		return await mapNullable(
			this[rawDataSymbol].shared_chat_pay_it_forward.gifter_user_id,
			async id => await this._client.users.getUserById(id),
		);
	}
}
