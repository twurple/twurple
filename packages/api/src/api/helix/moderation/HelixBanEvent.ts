import { Enumerable, mapNullable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixEventData } from '../HelixEvent';
import type { HelixUser } from '../user/HelixUser';
import type { HelixBanData } from './HelixBan';

/**
 * The different types a ban event can have.
 */
export type HelixBanEventType = 'moderation.user.ban' | 'moderation.user.unban';

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
@rtfm<HelixBanEvent>('api', 'HelixBanEvent', 'userId')
export class HelixBanEvent extends DataObject<HelixBanEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixBanEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The unique ID of the ban event.
	 */
	get eventId(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The type of the ban event.
	 */
	get eventType(): HelixBanEventType {
		return this[rawDataSymbol].event_type;
	}

	/**
	 * The date of the ban event.
	 */
	get eventDate(): Date {
		return new Date(this[rawDataSymbol].event_timestamp);
	}

	/**
	 * The version of the ban event.
	 */
	get eventVersion(): string {
		return this[rawDataSymbol].version;
	}

	/**
	 * The ID of the banned user.
	 */
	get userId(): string {
		return this[rawDataSymbol].event_data.user_id;
	}

	/**
	 * The name of the banned user.
	 */
	get userName(): string {
		return this[rawDataSymbol].event_data.user_login;
	}

	/**
	 * The display name of the banned user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].event_data.user_name;
	}

	/**
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].event_data.user_id))!;
	}

	/**
	 * The ID of the broadcaster from whose chat the user was banned/unbanned.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].event_data.broadcaster_id;
	}

	/**
	 * The name of the broadcaster from whose chat the user was banned/unbanned.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].event_data.broadcaster_login;
	}

	/**
	 * The display name of the broadcaster from whose chat the user was banned/unbanned.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].event_data.broadcaster_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].event_data.broadcaster_id))!;
	}

	/**
	 * The date when the ban will expire; null for permanent bans.
	 */
	get expiryDate(): Date | null {
		return mapNullable(this[rawDataSymbol].event_data.expires_at, v => new Date(v));
	}
}
