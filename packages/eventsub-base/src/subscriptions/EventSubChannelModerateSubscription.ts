import { type HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';
import { type EventSubChannelModerationEvent } from '../events/moderation/EventSubChannelModerationEvent.js';
import { type EventSubChannelModerationActionEventData } from '../events/moderation/EventSubChannelModerationEvent.external.js';
import { EventSubChannelBanModerationEvent } from '../events/moderation/EventSubChannelBanModerationEvent.js';
import { EventSubChannelDeleteModerationEvent } from '../events/moderation/EventSubChannelDeleteModerationEvent.js';
import { EventSubChannelTimeoutModerationEvent } from '../events/moderation/EventSubChannelTimeoutModerationEvent.js';
import { EventSubChannelClearModerationEvent } from '../events/moderation/EventSubChannelClearModerationEvent.js';
import { EventSubChannelAutoModTermsModerationEvent } from '../events/moderation/EventSubChannelAutoModTermsModerationEvent.js';
import { EventSubChannelUnbanRequestModerationEvent } from '../events/moderation/EventSubChannelUnbanRequestModerationEvent.js';
import { EventSubChannelUnbanModerationEvent } from '../events/moderation/EventSubChannelUnbanModerationEvent.js';
import { EventSubChannelUntimeoutModerationEvent } from '../events/moderation/EventSubChannelUntimeoutModerationEvent.js';
import { EventSubChannelEmoteOnlyModerationEvent } from '../events/moderation/EventSubChannelEmoteOnlyModerationEvent.js';
import { EventSubChannelEmoteOnlyOffModerationEvent } from '../events/moderation/EventSubChannelEmoteOnlyOffModerationEvent.js';
import { EventSubChannelFollowersModerationEvent } from '../events/moderation/EventSubChannelFollowersModerationEvent.js';
import { EventSubChannelFollowersOffModerationEvent } from '../events/moderation/EventSubChannelFollowersOffModerationEvent.js';
import { EventSubChannelUniqueChatModerationEvent } from '../events/moderation/EventSubChannelUniqueChatModerationEvent.js';
import { EventSubChannelUniqueChatOffModerationEvent } from '../events/moderation/EventSubChannelUniqueChatOffModerationEvent.js';
import { EventSubChannelSlowModerationEvent } from '../events/moderation/EventSubChannelSlowModerationEvent.js';
import { EventSubChannelSlowOffModerationEvent } from '../events/moderation/EventSubChannelSlowOffModerationEvent.js';
import { EventSubChannelSubscribersModerationEvent } from '../events/moderation/EventSubChannelSubscribersModerationEvent.js';
import { EventSubChannelSubscribersOffModerationEvent } from '../events/moderation/EventSubChannelSubscribersOffModerationEvent.js';
import { EventSubChannelRaidModerationEvent } from '../events/moderation/EventSubChannelRaidModerationEvent.js';
import { EventSubChannelUnraidModerationEvent } from '../events/moderation/EventSubChannelUnraidModerationEvent.js';
import { EventSubChannelModModerationEvent } from '../events/moderation/EventSubChannelModModerationEvent.js';
import { EventSubChannelUnmodModerationEvent } from '../events/moderation/EventSubChannelUnmodModerationEvent.js';
import { EventSubChannelVipModerationEvent } from '../events/moderation/EventSubChannelVipModerationEvent.js';
import { EventSubChannelUnvipModerationEvent } from '../events/moderation/EventSubChannelUnvipModerationEvent.js';
import { EventSubChannelWarnModerationEvent } from '../events/moderation/EventSubChannelWarnModerationEvent.js';
import { EventSubChannelSharedChatDeleteModerationEvent } from '../events/moderation/EventSubChannelSharedChatDeleteModerationEvent.js';
import { EventSubChannelSharedChatBanModerationEvent } from '../events/moderation/EventSubChannelSharedChatBanModerationEvent.js';
import { EventSubChannelSharedChatTimeoutModerationEvent } from '../events/moderation/EventSubChannelSharedChatTimeoutModerationEvent.js';
import { EventSubChannelSharedChatUnbanModerationEvent } from '../events/moderation/EventSubChannelSharedChatUnbanModerationEvent.js';
import { EventSubChannelSharedChatUntimeoutModerationEvent } from '../events/moderation/EventSubChannelSharedChatUntimeoutModerationEvent.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelModerateSubscription extends EventSubSubscription<EventSubChannelModerationEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelModerationEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _moderatorId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.moderate.${this._broadcasterId}.${this._moderatorId}`;
	}

	get authUserId(): string | null {
		return this._moderatorId;
	}

	protected transformData(data: EventSubChannelModerationActionEventData): EventSubChannelModerationEvent {
		switch (data.action) {
			case 'delete':
				return new EventSubChannelDeleteModerationEvent(data, this._client._apiClient);

			case 'clear':
				return new EventSubChannelClearModerationEvent(data, this._client._apiClient);

			case 'timeout':
				return new EventSubChannelTimeoutModerationEvent(data, this._client._apiClient);

			case 'untimeout':
				return new EventSubChannelUntimeoutModerationEvent(data, this._client._apiClient);

			case 'ban':
				return new EventSubChannelBanModerationEvent(data, this._client._apiClient);

			case 'unban':
				return new EventSubChannelUnbanModerationEvent(data, this._client._apiClient);

			case 'emoteonly':
				return new EventSubChannelEmoteOnlyModerationEvent(data, this._client._apiClient);

			case 'emoteonlyoff':
				return new EventSubChannelEmoteOnlyOffModerationEvent(data, this._client._apiClient);

			case 'followers':
				return new EventSubChannelFollowersModerationEvent(data, this._client._apiClient);

			case 'followersoff':
				return new EventSubChannelFollowersOffModerationEvent(data, this._client._apiClient);

			case 'uniquechat':
				return new EventSubChannelUniqueChatModerationEvent(data, this._client._apiClient);

			case 'uniquechatoff':
				return new EventSubChannelUniqueChatOffModerationEvent(data, this._client._apiClient);

			case 'slow':
				return new EventSubChannelSlowModerationEvent(data, this._client._apiClient);

			case 'slowoff':
				return new EventSubChannelSlowOffModerationEvent(data, this._client._apiClient);

			case 'subscribers':
				return new EventSubChannelSubscribersModerationEvent(data, this._client._apiClient);

			case 'subscribersoff':
				return new EventSubChannelSubscribersOffModerationEvent(data, this._client._apiClient);

			case 'raid':
				return new EventSubChannelRaidModerationEvent(data, this._client._apiClient);

			case 'unraid':
				return new EventSubChannelUnraidModerationEvent(data, this._client._apiClient);

			case 'mod':
				return new EventSubChannelModModerationEvent(data, this._client._apiClient);

			case 'unmod':
				return new EventSubChannelUnmodModerationEvent(data, this._client._apiClient);

			case 'vip':
				return new EventSubChannelVipModerationEvent(data, this._client._apiClient);

			case 'unvip':
				return new EventSubChannelUnvipModerationEvent(data, this._client._apiClient);

			case 'warn':
				return new EventSubChannelWarnModerationEvent(data, this._client._apiClient);

			case 'add_blocked_term':
			case 'add_permitted_term':
			case 'remove_blocked_term':
			case 'remove_permitted_term':
				return new EventSubChannelAutoModTermsModerationEvent(data, data.action, this._client._apiClient);

			case 'approve_unban_request':
			case 'deny_unban_request':
				return new EventSubChannelUnbanRequestModerationEvent(data, data.action, this._client._apiClient);

			case 'shared_chat_ban':
				return new EventSubChannelSharedChatBanModerationEvent(data, this._client._apiClient);

			case 'shared_chat_unban':
				return new EventSubChannelSharedChatUnbanModerationEvent(data, this._client._apiClient);

			case 'shared_chat_timeout':
				return new EventSubChannelSharedChatTimeoutModerationEvent(data, this._client._apiClient);

			case 'shared_chat_untimeout':
				return new EventSubChannelSharedChatUntimeoutModerationEvent(data, this._client._apiClient);

			case 'shared_chat_delete':
				return new EventSubChannelSharedChatDeleteModerationEvent(data, this._client._apiClient);

			default:
				throw new Error(
					`Unknown moderation action: ${(data as EventSubChannelModerationActionEventData).action}`,
				);
		}
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.asUser(
			this._moderatorId,
			async ctx =>
				await ctx.eventSub.subscribeToChannelModerateEvents(
					this._broadcasterId,
					await this._getTransportOptions(),
				),
		);
	}
}
