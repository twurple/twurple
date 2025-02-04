import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelChatAnnouncementNotificationEvent } from '../events/chatNotifications/EventSubChannelChatAnnouncementNotificationEvent';
import { EventSubChannelChatBitsBadgeTierNotificationEvent } from '../events/chatNotifications/EventSubChannelChatBitsBadgeTierNotificationEvent';
import { EventSubChannelChatCharityDonationNotificationEvent } from '../events/chatNotifications/EventSubChannelChatCharityDonationNotificationEvent';
import { EventSubChannelChatCommunitySubGiftNotificationEvent } from '../events/chatNotifications/EventSubChannelChatCommunitySubGiftNotificationEvent';
import { EventSubChannelChatGiftPaidUpgradeNotificationEvent } from '../events/chatNotifications/EventSubChannelChatGiftPaidUpgradeNotificationEvent';
import { type EventSubChannelChatNotificationEvent } from '../events/chatNotifications/EventSubChannelChatNotificationEvent';
import { type EventSubChannelChatNotificationEventData } from '../events/chatNotifications/EventSubChannelChatNotificationEvent.external';
import { EventSubChannelChatPayItForwardNotificationEvent } from '../events/chatNotifications/EventSubChannelChatPayItForwardNotificationEvent';
import { EventSubChannelChatPrimePaidUpgradeNotificationEvent } from '../events/chatNotifications/EventSubChannelChatPrimePaidUpgradeNotificationEvent';
import { EventSubChannelChatRaidNotificationEvent } from '../events/chatNotifications/EventSubChannelChatRaidNotificationEvent';
import { EventSubChannelChatResubNotificationEvent } from '../events/chatNotifications/EventSubChannelChatResubNotificationEvent';
import { EventSubChannelChatSubGiftNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSubGiftNotificationEvent';
import { EventSubChannelChatSubNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSubNotificationEvent';
import { EventSubChannelChatUnraidNotificationEvent } from '../events/chatNotifications/EventSubChannelChatUnraidNotificationEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';
import { EventSubChannelChatSharedChatSubNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatSubNotificationEvent';
import { EventSubChannelChatSharedChatResubNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatResubNotificationEvent';
import { EventSubChannelChatSharedChatSubGiftNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatSubGiftNotificationEvent';
import { EventSubChannelChatSharedChatCommunitySubGiftNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatCommunitySubGiftNotificationEvent';
import { EventSubChannelChatSharedChatGiftPaidUpgradeNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatGiftPaidUpgradeNotificationEvent';
import { EventSubChannelChatSharedChatPrimePaidUpgradeNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatPrimePaidUpgradeNotificationEvent';
import { EventSubChannelChatSharedChatPayItForwardNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatPayItForwardNotificationEvent';
import { EventSubChannelChatSharedChatAnnouncementNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatAnnouncementNotificationEvent';
import { EventSubChannelChatSharedChatRaidNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatRaidNotificationEvent';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelChatNotificationSubscription extends EventSubSubscription<EventSubChannelChatNotificationEvent> {
	/** @protected */ readonly _cliName = 'chat-notification';

	constructor(
		handler: (data: EventSubChannelChatNotificationEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.chat.notification.${this._broadcasterId}.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelChatNotificationEventData): EventSubChannelChatNotificationEvent {
		switch (data.notice_type) {
			case 'sub':
				return new EventSubChannelChatSubNotificationEvent(data, this._client._apiClient);

			case 'resub':
				return new EventSubChannelChatResubNotificationEvent(data, this._client._apiClient);

			case 'sub_gift':
				return new EventSubChannelChatSubGiftNotificationEvent(data, this._client._apiClient);

			case 'community_sub_gift':
				return new EventSubChannelChatCommunitySubGiftNotificationEvent(data, this._client._apiClient);

			case 'gift_paid_upgrade':
				return new EventSubChannelChatGiftPaidUpgradeNotificationEvent(data, this._client._apiClient);

			case 'prime_paid_upgrade':
				return new EventSubChannelChatPrimePaidUpgradeNotificationEvent(data, this._client._apiClient);

			case 'raid':
				return new EventSubChannelChatRaidNotificationEvent(data, this._client._apiClient);

			case 'unraid':
				return new EventSubChannelChatUnraidNotificationEvent(data, this._client._apiClient);

			case 'pay_it_forward':
				return new EventSubChannelChatPayItForwardNotificationEvent(data, this._client._apiClient);

			case 'announcement':
				return new EventSubChannelChatAnnouncementNotificationEvent(data, this._client._apiClient);

			case 'charity_donation':
				return new EventSubChannelChatCharityDonationNotificationEvent(data, this._client._apiClient);

			case 'bits_badge_tier':
				return new EventSubChannelChatBitsBadgeTierNotificationEvent(data, this._client._apiClient);

			case 'shared_chat_sub':
				return new EventSubChannelChatSharedChatSubNotificationEvent(data, this._client._apiClient);

			case 'shared_chat_resub':
				return new EventSubChannelChatSharedChatResubNotificationEvent(data, this._client._apiClient);

			case 'shared_chat_sub_gift':
				return new EventSubChannelChatSharedChatSubGiftNotificationEvent(data, this._client._apiClient);

			case 'shared_chat_community_sub_gift':
				return new EventSubChannelChatSharedChatCommunitySubGiftNotificationEvent(
					data,
					this._client._apiClient,
				);

			case 'shared_chat_gift_paid_upgrade':
				return new EventSubChannelChatSharedChatGiftPaidUpgradeNotificationEvent(data, this._client._apiClient);

			case 'shared_chat_prime_paid_upgrade':
				return new EventSubChannelChatSharedChatPrimePaidUpgradeNotificationEvent(
					data,
					this._client._apiClient,
				);

			case 'shared_chat_pay_it_forward':
				return new EventSubChannelChatSharedChatPayItForwardNotificationEvent(data, this._client._apiClient);

			case 'shared_chat_raid':
				return new EventSubChannelChatSharedChatRaidNotificationEvent(data, this._client._apiClient);

			case 'shared_chat_announcement':
				return new EventSubChannelChatSharedChatAnnouncementNotificationEvent(data, this._client._apiClient);

			default:
				throw new Error(
					`Unknown chat notification type: ${(data as EventSubChannelChatNotificationEventData).notice_type}`,
				);
		}
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.asUser(
			this._userId,
			async ctx =>
				await ctx.eventSub.subscribeToChannelChatNotificationEvents(
					this._broadcasterId,
					await this._getTransportOptions(),
				),
		);
	}
}
