import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';

/** @private */
export interface EventSubChannelCheerEventData {
	is_anonymous: boolean;
	user_id: string | null;
	user_name: string | null;
	broadcaster_user_id: string;
	broadcaster_user_name: string;
	message: string;
	bits: number;
}

/**
 * An Eventsub event representing a user cheering bits
 */
export class EventSubChannelCheerEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubChannelCheerEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the cheering user, null if anonymous.
	 */
	get userId(): string | null {
		return this._data.user_id;
	}

	/**
	 * The display name of the cheering user, null if anonymous.
	 */
	get userDisplayName(): string | null {
		return this._data.user_name;
	}

	/**
	 * Retrieves more information about the user, if available
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.user_id!))!;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this._data.broadcaster_user_id;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this._data.broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.broadcaster_user_id))!;
	}

	/**
	 * Whether the cheering user chose to be anonymous
	 */
	get isAnonymous(): boolean {
		return this._data.is_anonymous;
	}

	/**
	 * The message sent with the cheer
	 */
	get message(): string {
		return this._data.message;
	}

	/**
	 * The number of bits cheered
	 */
	get bits(): number {
		return this._data.bits;
	}
}
