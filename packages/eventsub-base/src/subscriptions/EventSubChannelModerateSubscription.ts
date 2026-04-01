import { type HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelAutoModTermsModerationEvent } from '../events/moderation/EventSubChannelAutoModTermsModerationEvent.js';
import { EventSubChannelBanModerationEvent } from '../events/moderation/EventSubChannelBanModerationEvent.js';
import { EventSubChannelClearModerationEvent } from '../events/moderation/EventSubChannelClearModerationEvent.js';
import { EventSubChannelDeleteModerationEvent } from '../events/moderation/EventSubChannelDeleteModerationEvent.js';
import { EventSubChannelEmoteOnlyModerationEvent } from '../events/moderation/EventSubChannelEmoteOnlyModerationEvent.js';
import { EventSubChannelEmoteOnlyOffModerationEvent } from '../events/moderation/EventSubChannelEmoteOnlyOffModerationEvent.js';
import { EventSubChannelFollowersModerationEvent } from '../events/moderation/EventSubChannelFollowersModerationEvent.js';
import { EventSubChannelFollowersOffModerationEvent } from '../events/moderation/EventSubChannelFollowersOffModerationEvent.js';
import { type EventSubChannelModerationActionEventData } from '../events/moderation/EventSubChannelModerationEvent.external.js';
import { type EventSubChannelModerationEvent } from '../events/moderation/EventSubChannelModerationEvent.js';
import { EventSubChannelModModerationEvent } from '../events/moderation/EventSubChannelModModerationEvent.js';
import { EventSubChannelRaidModerationEvent } from '../events/moderation/EventSubChannelRaidModerationEvent.js';
import { EventSubChannelSharedChatBanModerationEvent } from '../events/moderation/EventSubChannelSharedChatBanModerationEvent.js';
import { EventSubChannelSharedChatDeleteModerationEvent } from '../events/moderation/EventSubChannelSharedChatDeleteModerationEvent.js';
import { EventSubChannelSharedChatTimeoutModerationEvent } from '../events/moderation/EventSubChannelSharedChatTimeoutModerationEvent.js';
import { EventSubChannelSharedChatUnbanModerationEvent } from '../events/moderation/EventSubChannelSharedChatUnbanModerationEvent.js';
import { EventSubChannelSharedChatUntimeoutModerationEvent } from '../events/moderation/EventSubChannelSharedChatUntimeoutModerationEvent.js';
import { EventSubChannelSlowModerationEvent } from '../events/moderation/EventSubChannelSlowModerationEvent.js';
import { EventSubChannelSlowOffModerationEvent } from '../events/moderation/EventSubChannelSlowOffModerationEvent.js';
import { EventSubChannelSubscribersModerationEvent } from '../events/moderation/EventSubChannelSubscribersModerationEvent.js';
import { EventSubChannelSubscribersOffModerationEvent } from '../events/moderation/EventSubChannelSubscribersOffModerationEvent.js';
import { EventSubChannelTimeoutModerationEvent } from '../events/moderation/EventSubChannelTimeoutModerationEvent.js';
import { EventSubChannelUnbanModerationEvent } from '../events/moderation/EventSubChannelUnbanModerationEvent.js';
import { EventSubChannelUnbanRequestModerationEvent } from '../events/moderation/EventSubChannelUnbanRequestModerationEvent.js';
import { EventSubChannelUniqueChatModerationEvent } from '../events/moderation/EventSubChannelUniqueChatModerationEvent.js';
import { EventSubChannelUniqueChatOffModerationEvent } from '../events/moderation/EventSubChannelUniqueChatOffModerationEvent.js';
import { EventSubChannelUnmodModerationEvent } from '../events/moderation/EventSubChannelUnmodModerationEvent.js';
import { EventSubChannelUnraidModerationEvent } from '../events/moderation/EventSubChannelUnraidModerationEvent.js';
import { EventSubChannelUntimeoutModerationEvent } from '../events/moderation/EventSubChannelUntimeoutModerationEvent.js';
import { EventSubChannelUnvipModerationEvent } from '../events/moderation/EventSubChannelUnvipModerationEvent.js';
import { EventSubChannelVipModerationEvent } from '../events/moderation/EventSubChannelVipModerationEvent.js';
import { EventSubChannelWarnModerationEvent } from '../events/moderation/EventSubChannelWarnModerationEvent.js';
import { type EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

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
				return this._client._config.managed
					? new EventSubChannelDeleteModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelDeleteModerationEvent(data);

			case 'clear':
				return this._client._config.managed
					? new EventSubChannelClearModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelClearModerationEvent(data);

			case 'timeout':
				return this._client._config.managed
					? new EventSubChannelTimeoutModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelTimeoutModerationEvent(data);

			case 'untimeout':
				return this._client._config.managed
					? new EventSubChannelUntimeoutModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelUntimeoutModerationEvent(data);

			case 'ban':
				return this._client._config.managed
					? new EventSubChannelBanModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelBanModerationEvent(data);

			case 'unban':
				return this._client._config.managed
					? new EventSubChannelUnbanModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelUnbanModerationEvent(data);

			case 'emoteonly':
				return this._client._config.managed
					? new EventSubChannelEmoteOnlyModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelEmoteOnlyModerationEvent(data);

			case 'emoteonlyoff':
				return this._client._config.managed
					? new EventSubChannelEmoteOnlyOffModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelEmoteOnlyOffModerationEvent(data);

			case 'followers':
				return this._client._config.managed
					? new EventSubChannelFollowersModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelFollowersModerationEvent(data);

			case 'followersoff':
				return this._client._config.managed
					? new EventSubChannelFollowersOffModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelFollowersOffModerationEvent(data);

			case 'uniquechat':
				return this._client._config.managed
					? new EventSubChannelUniqueChatModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelUniqueChatModerationEvent(data);

			case 'uniquechatoff':
				return this._client._config.managed
					? new EventSubChannelUniqueChatOffModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelUniqueChatOffModerationEvent(data);

			case 'slow':
				return this._client._config.managed
					? new EventSubChannelSlowModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelSlowModerationEvent(data);

			case 'slowoff':
				return this._client._config.managed
					? new EventSubChannelSlowOffModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelSlowOffModerationEvent(data);

			case 'subscribers':
				return this._client._config.managed
					? new EventSubChannelSubscribersModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelSubscribersModerationEvent(data);

			case 'subscribersoff':
				return this._client._config.managed
					? new EventSubChannelSubscribersOffModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelSubscribersOffModerationEvent(data);

			case 'raid':
				return this._client._config.managed
					? new EventSubChannelRaidModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelRaidModerationEvent(data);

			case 'unraid':
				return this._client._config.managed
					? new EventSubChannelUnraidModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelUnraidModerationEvent(data);

			case 'mod':
				return this._client._config.managed
					? new EventSubChannelModModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelModModerationEvent(data);

			case 'unmod':
				return this._client._config.managed
					? new EventSubChannelUnmodModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelUnmodModerationEvent(data);

			case 'vip':
				return this._client._config.managed
					? new EventSubChannelVipModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelVipModerationEvent(data);

			case 'unvip':
				return this._client._config.managed
					? new EventSubChannelUnvipModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelUnvipModerationEvent(data);

			case 'warn':
				return this._client._config.managed
					? new EventSubChannelWarnModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelWarnModerationEvent(data);

			case 'add_blocked_term':
			case 'add_permitted_term':
			case 'remove_blocked_term':
			case 'remove_permitted_term':
				return this._client._config.managed
					? new EventSubChannelAutoModTermsModerationEvent(data, data.action, this._client._config.apiClient)
					: new EventSubChannelAutoModTermsModerationEvent(data, data.action);

			case 'approve_unban_request':
			case 'deny_unban_request':
				return this._client._config.managed
					? new EventSubChannelUnbanRequestModerationEvent(data, data.action, this._client._config.apiClient)
					: new EventSubChannelUnbanRequestModerationEvent(data, data.action);

			case 'shared_chat_ban':
				return this._client._config.managed
					? new EventSubChannelSharedChatBanModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelSharedChatBanModerationEvent(data);

			case 'shared_chat_unban':
				return this._client._config.managed
					? new EventSubChannelSharedChatUnbanModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelSharedChatUnbanModerationEvent(data);

			case 'shared_chat_timeout':
				return this._client._config.managed
					? new EventSubChannelSharedChatTimeoutModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelSharedChatTimeoutModerationEvent(data);

			case 'shared_chat_untimeout':
				return this._client._config.managed
					? new EventSubChannelSharedChatUntimeoutModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelSharedChatUntimeoutModerationEvent(data);

			case 'shared_chat_delete':
				return this._client._config.managed
					? new EventSubChannelSharedChatDeleteModerationEvent(data, this._client._config.apiClient)
					: new EventSubChannelSharedChatDeleteModerationEvent(data);

			default:
				throw new Error(
					`Unknown moderation action: ${(data as EventSubChannelModerationActionEventData).action}`,
				);
		}
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._moderatorId,
					async ctx =>
						await ctx.eventSub.subscribeToChannelModerateEvents(
							this._broadcasterId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
