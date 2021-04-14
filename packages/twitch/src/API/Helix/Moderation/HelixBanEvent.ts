import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixEventData } from '../HelixEvent';
import type { HelixUser } from '../User/HelixUser';
import type { HelixBanData } from './HelixBan';
import { HelixBan } from './HelixBan';

/**
 * The different types a ban event can have.
 */
export enum HelixBanEventType {
	/**
	 * Sent when a user gets banned.
	 */
	Ban = 'moderation.user.ban',

	/**
	 * Sent when a user gets unbanned.
	 */
	Unban = 'moderation.user.unban'
}

/** @private */
export interface HelixBanEventDetail extends HelixBanData {
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
}

/** @private */
export type HelixBanEventData = HelixEventData<HelixBanEventDetail, HelixBanEventType>;

/**
 * An event that indicates the change of a ban status, i.e. banning or unbanning a user.
 *
 * @inheritDoc
 */
@rtfm<HelixBanEvent>('twitch', 'HelixBanEvent', 'userId')
export class HelixBanEvent extends HelixBan {
	@Enumerable(false) private readonly _eventData: HelixBanEventData;

	/** @private */
	constructor(eventData: HelixBanEventData, client: ApiClient) {
		super(eventData.event_data, client);
		this._eventData = eventData;
	}

	/**
	 * The unique ID of the ban event.
	 */
	get eventId(): string {
		return this._eventData.id;
	}

	/**
	 * The type of the ban event.
	 */
	get eventType(): HelixBanEventType {
		return this._eventData.event_type;
	}

	/**
	 * The date of the ban event.
	 */
	get eventDate(): Date {
		return new Date(this._eventData.event_timestamp);
	}

	/**
	 * The version of the ban event.
	 */
	get eventVersion(): string {
		return this._eventData.version;
	}

	/**
	 * The id of the broadcaster from whose chat the user was banned/unbanned.
	 */
	get broadcasterId(): string {
		return this._eventData.event_data.broadcaster_id;
	}

	/**
	 * The name of the broadcaster from whose chat the user was banned/unbanned.
	 */
	get broadcasterName(): string {
		return this._eventData.event_data.broadcaster_login;
	}

	/**
	 * The display name of the broadcaster from whose chat the user was banned/unbanned.
	 */
	get broadcasterDisplayName(): string {
		return this._eventData.event_data.broadcaster_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._eventData.event_data.broadcaster_id);
	}
}
