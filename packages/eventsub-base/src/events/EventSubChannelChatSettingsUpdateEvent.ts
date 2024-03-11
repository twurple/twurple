import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubChannelChatSettingsUpdateEventData } from './EventSubChannelChatSettingsUpdateEvent.external';

/**
 * An EventSub event representing chat settings being updated in a channel.
 */
@rtfm<EventSubChannelChatSettingsUpdateEvent>(
	'eventsub-base',
	'EventSubChannelChatSettingsUpdateEvent',
	'broadcasterId',
)
export class EventSubChannelChatSettingsUpdateEvent extends DataObject<EventSubChannelChatSettingsUpdateEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelChatSettingsUpdateEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * Whether emote only mode is enabled.
	 */
	get emoteOnlyModeEnabled(): boolean {
		return this[rawDataSymbol].emote_mode;
	}

	/**
	 * Whether follower only mode is enabled.
	 */
	get followerOnlyModeEnabled(): boolean {
		return this[rawDataSymbol].follower_mode;
	}

	/**
	 * The time after which users are able to send messages after following, in minutes.
	 *
	 * Is `null` if follower only mode is not enabled,
	 * but may also be `0` if you can send messages immediately after following.
	 */
	get followerOnlyModeDelay(): number | null {
		return this[rawDataSymbol].follower_mode_duration_minutes;
	}

	/**
	 * Whether slow mode is enabled.
	 */
	get slowModeEnabled(): boolean {
		return this[rawDataSymbol].slow_mode;
	}

	/**
	 * The time to wait between messages in slow mode, in seconds.
	 *
	 * Is `null` if slow mode is not enabled.
	 */
	get slowModeDelay(): number | null {
		return this[rawDataSymbol].slow_mode_wait_time_seconds;
	}

	/**
	 * Whether subscriber only mode is enabled.
	 */
	get subscriberOnlyModeEnabled(): boolean {
		return this[rawDataSymbol].subscriber_mode;
	}

	/**
	 * Whether unique chat mode is enabled.
	 */
	get uniqueChatModeEnabled(): boolean {
		return this[rawDataSymbol].unique_chat_mode;
	}
}
