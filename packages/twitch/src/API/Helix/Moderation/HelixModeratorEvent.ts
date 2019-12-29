import TwitchClient from '../../../TwitchClient';
import { HelixEventData } from '../HelixEvent';
import HelixModerator, { HelixModeratorData } from './HelixModerator';

/**
 * The different types a moderator event can have.
 */
export enum HelixModeratorEventType {
	/**
	 * Sent when a user gains moderation privileges.
	 */
	Add = 'moderation.moderator.add',

	/**
	 * Sent when a user loses moderation privileges.
	 */
	Remove = 'moderation.moderator.remove'
}

/** @private */
export interface HelixModeratorEventDetail extends HelixModeratorData {
	broadcaster_id: string;
	broadcaster_name: string;
}

/** @private */
export type HelixModeratorEventData = HelixEventData<HelixModeratorEventDetail, HelixModeratorEventType>;

/**
 * An event that indicates the change of a moderator status, i.e. gaining or losing moderation privileges.
 */
export default class HelixModeratorEvent extends HelixModerator {
	/** @private */
	constructor(private readonly _eventData: HelixModeratorEventData, client: TwitchClient) {
		super(_eventData.event_data, client);
	}

	/**
	 * The unique ID of the moderator event.
	 */
	get eventId() {
		return this._eventData.id;
	}

	/**
	 * The type of the moderator event.
	 */
	get eventType() {
		return this._eventData.event_type;
	}

	/**
	 * The date of the moderator event.
	 */
	get eventDate() {
		return new Date(this._eventData.event_timestamp);
	}

	/**
	 * The version of the moderator event.
	 */
	get eventVersion() {
		return this._eventData.version;
	}

	/**
	 * The id of the broadcaster where the user gained/lost moderation privileges.
	 */
	get broadcasterId() {
		return this._eventData.event_data.broadcaster_id;
	}

	/**
	 * Retrieves more data about the broadcaster.
	 */
	async getBroadcaster() {
		return this._client.helix.users.getUserById(this._eventData.event_data.broadcaster_id);
	}

	/**
	 * The name of the broadcaster where the user gained/lost moderation privileges.
	 */
	get broadcasterName() {
		return this._eventData.event_data.broadcaster_id;
	}
}
