import { type HelixUser } from '@twurple/api';
import { checkRelationAssertion, rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent';
import { type EventSubChannelChatSharedChatRaidNotificationEventData } from './EventSubChannelChatNotificationEvent.external';

/**
 * An EventSub event representing an incoming raid notification in another channel's chat during a shared chat session.
 */
@rtfm<EventSubChannelChatSharedChatRaidNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatSharedChatRaidNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatSharedChatRaidNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatSharedChatRaidNotificationEventData;

	readonly type = 'shared_chat_raid' as const;

	/**
	 * The ID of the user that raided the channel.
	 */
	get raiderId(): string {
		return this[rawDataSymbol].shared_chat_raid.user_id;
	}

	/**
	 * The username of the user that raided the channel.
	 */
	get raiderName(): string {
		return this[rawDataSymbol].shared_chat_raid.user_login;
	}

	/**
	 * The display name of the user that raided the channel.
	 */
	get raiderDisplayName(): string {
		return this[rawDataSymbol].shared_chat_raid.user_name;
	}

	/**
	 * Gets more information about the user that raided the channel.
	 */
	async getRaider(): Promise<HelixUser> {
		return checkRelationAssertion(
			await this._client.users.getUserById(this[rawDataSymbol].shared_chat_raid.user_id),
		);
	}

	/**
	 * The amount of viewers the channel was raided with.
	 */
	get viewerCount(): number {
		return this[rawDataSymbol].shared_chat_raid.viewer_count;
	}

	/**
	 * The URL to the profile image of the user that raided the channel.
	 */
	get raiderProfileImageUrl(): string {
		return this[rawDataSymbol].shared_chat_raid.profile_image_url;
	}
}
