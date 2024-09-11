import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';
import {
	type EventSubChannelBaseModerationEventData,
	type EventSubChannelModerationAction,
	type EventSubChannelUnbanRequestModerationEventData,
} from './EventSubChannelModerationEvent.external';
import { type ApiClient, type HelixUser } from '@twurple/api';

/**
 * An EventSub event representing a moderator resolving an unban request on a channel.
 */
@rtfm<EventSubChannelUnbanRequestModerationEvent>(
	'eventsub-base',
	'EventSubChannelUnbanRequestModerationEvent',
	'broadcasterId',
)
export class EventSubChannelUnbanRequestModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelUnbanRequestModerationEventData;

	override readonly moderationAction: Extract<
		EventSubChannelModerationAction,
		'approve_unban_request' | 'deny_unban_request'
	>;

	/** @internal */
	constructor(
		data: EventSubChannelBaseModerationEventData,
		action: Extract<EventSubChannelModerationAction, 'approve_unban_request' | 'deny_unban_request'>,
		client: ApiClient,
	) {
		super(data, client);
		this.moderationAction = action;
	}

	/**
	 * Whether the unban request was approved or denied.
	 */
	get isApproved(): boolean {
		return this[rawDataSymbol].unban_request.is_approved;
	}

	/**
	 * The ID of the banned user.
	 */
	get userId(): string {
		return this[rawDataSymbol].unban_request.user_id;
	}

	/**
	 * The name of the banned user.
	 */
	get userName(): string {
		return this[rawDataSymbol].unban_request.user_login;
	}

	/**
	 * The display name of the banned user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].unban_request.user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].unban_request.user_id);
	}

	/**
	 * The message included by the moderator explaining their approval or denial.
	 */
	get moderatorMessage(): string {
		return this[rawDataSymbol].unban_request.moderator_message;
	}
}
