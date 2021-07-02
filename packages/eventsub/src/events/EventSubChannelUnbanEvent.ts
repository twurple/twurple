import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export interface EventSubChannelUnbanEventData {
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	moderator_user_id: string;
	moderator_user_login: string;
	moderator_user_name: string;
}

/**
 * An EventSub event representing a user being unbanned in a channel.
 */
@rtfm<EventSubChannelUnbanEvent>('eventsub', 'EventSubChannelUnbanEvent', 'userId')
export class EventSubChannelUnbanEvent extends DataObject<EventSubChannelUnbanEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelUnbanEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the unbanned user.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the unbanned user.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the unbanned user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Retrieves more information about the unbanned user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this[rawDataSymbol].user_id))!;
	}

	/**
	 * The ID of the broadcaster from whose chat the user was unbanned.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster from whose chat the user was unbanned.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster from whose chat the user was unbanned.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this[rawDataSymbol].broadcaster_user_id))!;
	}

	/**
	 * The ID of the moderator who issued the unban.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].moderator_user_id;
	}

	/**
	 * The name of the moderator who issued the unban.
	 */
	get moderatorName(): string {
		return this[rawDataSymbol].moderator_user_login;
	}

	/**
	 * The display name of the moderator who issued the unban.
	 */
	get moderatorDisplayName(): string {
		return this[rawDataSymbol].moderator_user_name;
	}

	/**
	 * Retrieves more information about the moderator.
	 */
	async getModerator(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this[rawDataSymbol].moderator_user_id))!;
	}
}
