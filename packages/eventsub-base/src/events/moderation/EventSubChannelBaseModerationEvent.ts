import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type EventSubChannelBaseModerationEventData,
	type EventSubChannelModerationAction,
} from './EventSubChannelModerationEvent.external';
import { type ApiClient, type HelixUser } from '@twurple/api';
import { Enumerable } from '@d-fischer/shared-utils';

@rtfm<EventSubChannelBaseModerationEvent>('eventsub-base', 'EventSubChannelBaseModerationEvent', 'broadcasterId')
export abstract class EventSubChannelBaseModerationEvent extends DataObject<EventSubChannelBaseModerationEventData> {
	/** @internal */ @Enumerable(false) protected readonly _client: ApiClient;

	/**
	 * The moderation action performed in the channel's chat.
	 */
	abstract readonly moderationAction: EventSubChannelModerationAction;

	/** @internal */
	constructor(data: EventSubChannelBaseModerationEventData, client: ApiClient) {
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
	async getBroadcaster(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id);
	}

	/**
	 * The ID of the moderator who performed the action.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].moderator_user_id;
	}

	/**
	 * The name of the moderator who performed the action.
	 */
	get moderatorName(): string {
		return this[rawDataSymbol].moderator_user_login;
	}

	/**
	 * The display name of the moderator who performed the action.
	 */
	get moderatorDisplayName(): string {
		return this[rawDataSymbol].moderator_user_name;
	}

	/**
	 * Gets more information about the broadcaster.
	 */
	async getModerator(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].moderator_user_id);
	}
}
