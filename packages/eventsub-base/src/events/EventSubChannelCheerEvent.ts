import { Enumerable, mapNullable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export interface EventSubChannelCheerEventData {
	is_anonymous: boolean;
	user_id: string | null;
	user_login: string | null;
	user_name: string | null;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	message: string;
	bits: number;
}

/**
 * An EventSub event representing a user cheering bits.
 */
@rtfm<EventSubChannelCheerEvent>('eventsub-base', 'EventSubChannelCheerEvent', 'userId')
export class EventSubChannelCheerEvent extends DataObject<EventSubChannelCheerEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelCheerEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the cheering user, null if anonymous.
	 */
	get userId(): string | null {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the cheering user, null if anonymous.
	 */
	get userName(): string | null {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the cheering user, null if anonymous.
	 */
	get userDisplayName(): string | null {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await mapNullable(this[rawDataSymbol].user_id, async v => await this._client.users.getUserById(v));
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
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id))!;
	}

	/**
	 * Whether the cheering user chose to be anonymous.
	 */
	get isAnonymous(): boolean {
		return this[rawDataSymbol].is_anonymous;
	}

	/**
	 * The message sent with the cheer.
	 */
	get message(): string {
		return this[rawDataSymbol].message;
	}

	/**
	 * The amount of bits cheered.
	 */
	get bits(): number {
		return this[rawDataSymbol].bits;
	}
}
