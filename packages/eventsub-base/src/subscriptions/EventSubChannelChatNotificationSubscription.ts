import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelChatAnnouncementNotificationEvent } from '../events/chatNotifications/EventSubChannelChatAnnouncementNotificationEvent.js';
import { EventSubChannelChatBitsBadgeTierNotificationEvent } from '../events/chatNotifications/EventSubChannelChatBitsBadgeTierNotificationEvent.js';
import { EventSubChannelChatCharityDonationNotificationEvent } from '../events/chatNotifications/EventSubChannelChatCharityDonationNotificationEvent.js';
import { EventSubChannelChatCommunitySubGiftNotificationEvent } from '../events/chatNotifications/EventSubChannelChatCommunitySubGiftNotificationEvent.js';
import { EventSubChannelChatGiftPaidUpgradeNotificationEvent } from '../events/chatNotifications/EventSubChannelChatGiftPaidUpgradeNotificationEvent.js';
import { type EventSubChannelChatNotificationEventData } from '../events/chatNotifications/EventSubChannelChatNotificationEvent.external.js';
import { type EventSubChannelChatNotificationEvent } from '../events/chatNotifications/EventSubChannelChatNotificationEvent.js';
import { EventSubChannelChatPayItForwardNotificationEvent } from '../events/chatNotifications/EventSubChannelChatPayItForwardNotificationEvent.js';
import { EventSubChannelChatPrimePaidUpgradeNotificationEvent } from '../events/chatNotifications/EventSubChannelChatPrimePaidUpgradeNotificationEvent.js';
import { EventSubChannelChatRaidNotificationEvent } from '../events/chatNotifications/EventSubChannelChatRaidNotificationEvent.js';
import { EventSubChannelChatResubNotificationEvent } from '../events/chatNotifications/EventSubChannelChatResubNotificationEvent.js';
import { EventSubChannelChatSharedChatAnnouncementNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatAnnouncementNotificationEvent.js';
import { EventSubChannelChatSharedChatCommunitySubGiftNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatCommunitySubGiftNotificationEvent.js';
import { EventSubChannelChatSharedChatGiftPaidUpgradeNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatGiftPaidUpgradeNotificationEvent.js';
import { EventSubChannelChatSharedChatPayItForwardNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatPayItForwardNotificationEvent.js';
import { EventSubChannelChatSharedChatPrimePaidUpgradeNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatPrimePaidUpgradeNotificationEvent.js';
import { EventSubChannelChatSharedChatRaidNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatRaidNotificationEvent.js';
import { EventSubChannelChatSharedChatResubNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatResubNotificationEvent.js';
import { EventSubChannelChatSharedChatSubGiftNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatSubGiftNotificationEvent.js';
import { EventSubChannelChatSharedChatSubNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSharedChatSubNotificationEvent.js';
import { EventSubChannelChatSubGiftNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSubGiftNotificationEvent.js';
import { EventSubChannelChatSubNotificationEvent } from '../events/chatNotifications/EventSubChannelChatSubNotificationEvent.js';
import { EventSubChannelChatUnraidNotificationEvent } from '../events/chatNotifications/EventSubChannelChatUnraidNotificationEvent.js';
import { EventSubChannelChatWatchStreakNotificationEvent } from '../events/chatNotifications/EventSubChannelChatWatchStreakNotificationEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

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
				return this._client._config.managed
					? new EventSubChannelChatSubNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatSubNotificationEvent(data);

			case 'resub':
				return this._client._config.managed
					? new EventSubChannelChatResubNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatResubNotificationEvent(data);

			case 'sub_gift':
				return this._client._config.managed
					? new EventSubChannelChatSubGiftNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatSubGiftNotificationEvent(data);

			case 'community_sub_gift':
				return this._client._config.managed
					? new EventSubChannelChatCommunitySubGiftNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatCommunitySubGiftNotificationEvent(data);

			case 'gift_paid_upgrade':
				return this._client._config.managed
					? new EventSubChannelChatGiftPaidUpgradeNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatGiftPaidUpgradeNotificationEvent(data);

			case 'prime_paid_upgrade':
				return this._client._config.managed
					? new EventSubChannelChatPrimePaidUpgradeNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatPrimePaidUpgradeNotificationEvent(data);

			case 'raid':
				return this._client._config.managed
					? new EventSubChannelChatRaidNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatRaidNotificationEvent(data);

			case 'unraid':
				return this._client._config.managed
					? new EventSubChannelChatUnraidNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatUnraidNotificationEvent(data);

			case 'pay_it_forward':
				return this._client._config.managed
					? new EventSubChannelChatPayItForwardNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatPayItForwardNotificationEvent(data);

			case 'announcement':
				return this._client._config.managed
					? new EventSubChannelChatAnnouncementNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatAnnouncementNotificationEvent(data);

			case 'charity_donation':
				return this._client._config.managed
					? new EventSubChannelChatCharityDonationNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatCharityDonationNotificationEvent(data);

			case 'bits_badge_tier':
				return this._client._config.managed
					? new EventSubChannelChatBitsBadgeTierNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatBitsBadgeTierNotificationEvent(data);

			case 'watch_streak':
				return this._client._config.managed
					? new EventSubChannelChatWatchStreakNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatWatchStreakNotificationEvent(data);

			case 'shared_chat_sub':
				return this._client._config.managed
					? new EventSubChannelChatSharedChatSubNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatSharedChatSubNotificationEvent(data);

			case 'shared_chat_resub':
				return this._client._config.managed
					? new EventSubChannelChatSharedChatResubNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatSharedChatResubNotificationEvent(data);

			case 'shared_chat_sub_gift':
				return this._client._config.managed
					? new EventSubChannelChatSharedChatSubGiftNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatSharedChatSubGiftNotificationEvent(data);

			case 'shared_chat_community_sub_gift':
				return this._client._config.managed
					? new EventSubChannelChatSharedChatCommunitySubGiftNotificationEvent(
							data,
							this._client._config.apiClient,
					  )
					: new EventSubChannelChatSharedChatCommunitySubGiftNotificationEvent(data);

			case 'shared_chat_gift_paid_upgrade':
				return this._client._config.managed
					? new EventSubChannelChatSharedChatGiftPaidUpgradeNotificationEvent(
							data,
							this._client._config.apiClient,
					  )
					: new EventSubChannelChatSharedChatGiftPaidUpgradeNotificationEvent(data);

			case 'shared_chat_prime_paid_upgrade':
				return this._client._config.managed
					? new EventSubChannelChatSharedChatPrimePaidUpgradeNotificationEvent(
							data,
							this._client._config.apiClient,
					  )
					: new EventSubChannelChatSharedChatPrimePaidUpgradeNotificationEvent(data);

			case 'shared_chat_pay_it_forward':
				return this._client._config.managed
					? new EventSubChannelChatSharedChatPayItForwardNotificationEvent(
							data,
							this._client._config.apiClient,
					  )
					: new EventSubChannelChatSharedChatPayItForwardNotificationEvent(data);

			case 'shared_chat_raid':
				return this._client._config.managed
					? new EventSubChannelChatSharedChatRaidNotificationEvent(data, this._client._config.apiClient)
					: new EventSubChannelChatSharedChatRaidNotificationEvent(data);

			case 'shared_chat_announcement':
				return this._client._config.managed
					? new EventSubChannelChatSharedChatAnnouncementNotificationEvent(
							data,
							this._client._config.apiClient,
					  )
					: new EventSubChannelChatSharedChatAnnouncementNotificationEvent(data);

			default:
				throw new Error(
					`Unknown chat notification type: ${(data as EventSubChannelChatNotificationEventData).notice_type}`,
				);
		}
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._userId,
					async ctx =>
						await ctx.eventSub.subscribeToChannelChatNotificationEvents(
							this._broadcasterId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
