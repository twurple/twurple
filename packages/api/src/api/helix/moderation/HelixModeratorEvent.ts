import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixEventData } from '../HelixEvent';
import type { HelixUser } from '../user/HelixUser';
import type { HelixModeratorData } from './HelixModerator';

/**
 * The different types a moderator event can have.
 */
export type HelixModeratorEventType = 'moderation.moderator.add' | 'moderation.moderator.remove';

/** @private */
export interface HelixModeratorEventDetail extends HelixModeratorData {
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
}

/** @private */
export type HelixModeratorEventData = HelixEventData<HelixModeratorEventDetail, HelixModeratorEventType>;

/**
 * An event that indicates the change of a moderator status, i.e. gaining or losing moderation privileges.
 */
@rtfm<HelixModeratorEvent>('api', 'HelixModeratorEvent', 'userId')
export class HelixModeratorEvent extends DataObject<HelixModeratorEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(eventData: HelixModeratorEventData, client: ApiClient) {
		super(eventData);
		this._client = client;
	}

	/**
	 * The unique ID of the moderator event.
	 */
	get eventId(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The type of the moderator event.
	 */
	get eventType(): HelixModeratorEventType {
		return this[rawDataSymbol].event_type;
	}

	/**
	 * The date of the moderator event.
	 */
	get eventDate(): Date {
		return new Date(this[rawDataSymbol].event_timestamp);
	}

	/**
	 * The version of the moderator event.
	 */
	get eventVersion(): string {
		return this[rawDataSymbol].version;
	}

	/**
	 * The ID of the user.
	 */
	get userId(): string {
		return this[rawDataSymbol].event_data.user_id;
	}

	/**
	 * The name of the user.
	 */
	get userName(): string {
		return this[rawDataSymbol].event_data.user_login;
	}

	/**
	 * The display name of the user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].event_data.user_name;
	}

	/**
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this[rawDataSymbol].event_data.user_id))!;
	}

	/**
	 * The id of the broadcaster where the user gained/lost moderation privileges.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].event_data.broadcaster_id;
	}

	/**
	 * The name of the broadcaster where the user gained/lost moderation privileges.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].event_data.broadcaster_login;
	}

	/**
	 * The display name of the broadcaster where the user gained/lost moderation privileges.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].event_data.broadcaster_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this[rawDataSymbol].event_data.broadcaster_id))!;
	}
}
