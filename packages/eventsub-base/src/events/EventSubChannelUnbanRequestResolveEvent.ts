import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type EventSubChannelUnbanRequestResolveEventData,
	type EventSubChannelUnbanRequestStatus,
} from './EventSubChannelUnbanRequestResolveEvent.external';

/**
 * An EventSub event representing an unban request in a channel.
 */
@rtfm<EventSubChannelUnbanRequestResolveEvent>('eventsub-base', 'EventSubChannelUnbanRequestResolveEvent', 'id')
export class EventSubChannelUnbanRequestResolveEvent extends DataObject<EventSubChannelUnbanRequestResolveEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelUnbanRequestResolveEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the unban request.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The ID of the broadcaster in which channel the unban request was resolved.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster in which channel the unban request was resolved.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster in which channel the unban request was resolved.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Gets more information about the broadcaster in which channel the unban request was resolved.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * The ID of the moderator that resolved the unban request.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].moderator_user_id;
	}

	/**
	 * The name of the moderator that resolved the unban request.
	 */
	get moderatorName(): string {
		return this[rawDataSymbol].moderator_user_login;
	}

	/**
	 * The display name of the moderator that resolved the unban request.
	 */
	get moderatorDisplayName(): string {
		return this[rawDataSymbol].moderator_user_name;
	}

	/**
	 * Gets more information about the moderator that resolved the unban request.
	 */
	async getModerator(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].moderator_user_id));
	}

	/**
	 * The ID of the user that requested to be unbanned.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user that requested to be unbanned.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user that requested to be unbanned.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets more information about the user that requested to be unbanned.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * Resolution text supplied by the mod/broadcaster upon approval/denial of the request.
	 */
	get resolutionMessage(): string | null {
		return this[rawDataSymbol].resolution_text ?? null;
	}

	/**
	 * The status of the resolved unban request.
	 */
	get status(): EventSubChannelUnbanRequestStatus {
		return this[rawDataSymbol].status;
	}
}
