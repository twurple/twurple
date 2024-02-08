import { type HelixUser } from '@twurple/api';
import { checkRelationAssertion, rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent';
import { type EventSubChannelChatRaidNotificationEventData } from './EventSubChannelChatNotificationEvent.external';

/**
 * An EventSub event representing an incoming raid notification in a channel's chat.
 */
@rtfm<EventSubChannelChatRaidNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatRaidNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatRaidNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatRaidNotificationEventData;

	readonly type = 'raid';

	/**
	 * The ID of the user that raided the channel.
	 */
	get raiderId(): string | null {
		return this[rawDataSymbol].raid.user_id;
	}

	/**
	 * The username of the user that raided the channel.
	 */
	get raiderName(): string | null {
		return this[rawDataSymbol].raid.user_login;
	}

	/**
	 * The display name of the user that raided the channel.
	 */
	get raiderDisplayName(): string | null {
		return this[rawDataSymbol].raid.user_name;
	}

	/**
	 * Gets more information about the user that raided the channel.
	 */
	async getGifter(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].raid.user_id));
	}

	/**
	 * The amount of viewers the channel was raided with.
	 */
	get viewerCount(): number {
		return this[rawDataSymbol].raid.viewer_count;
	}

	/**
	 * The URL to the profile image of the user that raided the channel.
	 */
	get raiderProfileImageUrl(): string {
		return this[rawDataSymbol].raid.profile_image_url;
	}
}
