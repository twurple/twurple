import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixEventData } from '../HelixEvent';
import type { HelixUser } from '../user/HelixUser';
import type { HelixModeratorData } from './HelixModerator';
import { HelixModerator } from './HelixModerator';

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
export class HelixModeratorEvent extends HelixModerator {
	private readonly _eventData: HelixModeratorEventData;

	/** @private */
	constructor(eventData: HelixModeratorEventData, client: ApiClient) {
		super(eventData.event_data, client);
		this._eventData = eventData;
	}

	/**
	 * The unique ID of the moderator event.
	 */
	get eventId(): string {
		return this._eventData.id;
	}

	/**
	 * The type of the moderator event.
	 */
	get eventType(): HelixModeratorEventType {
		return this._eventData.event_type;
	}

	/**
	 * The date of the moderator event.
	 */
	get eventDate(): Date {
		return new Date(this._eventData.event_timestamp);
	}

	/**
	 * The version of the moderator event.
	 */
	get eventVersion(): string {
		return this._eventData.version;
	}

	/**
	 * The id of the broadcaster where the user gained/lost moderation privileges.
	 */
	get broadcasterId(): string {
		return this._eventData.event_data.broadcaster_id;
	}

	/**
	 * The name of the broadcaster where the user gained/lost moderation privileges.
	 */
	get broadcasterName(): string {
		return this._eventData.event_data.broadcaster_login;
	}

	/**
	 * The display name of the broadcaster where the user gained/lost moderation privileges.
	 */
	get broadcasterDisplayName(): string {
		return this._eventData.event_data.broadcaster_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._eventData.event_data.broadcaster_id))!;
	}
}
