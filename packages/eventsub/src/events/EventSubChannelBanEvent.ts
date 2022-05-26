import { Enumerable, mapNullable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export interface EventSubChannelBanEventData {
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	moderator_user_id: string;
	moderator_user_login: string;
	moderator_user_name: string;
	reason: string;
	banned_at: string;
	ends_at: string | null;
	is_permanent: boolean;
}

/**
 * An EventSub event representing a user being banned in a channel.
 */
@rtfm<EventSubChannelBanEvent>('eventsub', 'EventSubChannelBanEvent', 'userId')
export class EventSubChannelBanEvent extends DataObject<EventSubChannelBanEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelBanEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the banned user.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the banned user.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the banned user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Retrieves more information about the banned user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
	}

	/**
	 * The ID of the broadcaster from whose chat the user was banned.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster from whose chat the user was banned.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster from whose chat the user was banned.
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
	 * The ID of the moderator who issued the ban/timeout.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].moderator_user_id;
	}

	/**
	 * The name of the moderator who issued the ban/timeout.
	 */
	get moderatorName(): string {
		return this[rawDataSymbol].moderator_user_login;
	}

	/**
	 * The display name of the moderator who issued the ban/timeout.
	 */
	get moderatorDisplayName(): string {
		return this[rawDataSymbol].moderator_user_name;
	}

	/**
	 * Retrieves more information about the moderator.
	 */
	async getModerator(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].moderator_user_id))!;
	}

	/**
	 * The reason behind the ban.
	 */
	get reason(): string {
		return this[rawDataSymbol].reason;
	}

	/**
	 * The date and time when the user was banned or put in a timeout.
	 */
	get startDate(): Date {
		return new Date(this[rawDataSymbol].banned_at);
	}

	/**
	 * If it is a timeout, the date and time when the timeout will end. Will be null if permanent ban.
	 */
	get endDate(): Date | null {
		return mapNullable(this[rawDataSymbol].ends_at, v => new Date(v));
	}

	/**
	 * Whether the ban is permanent.
	 */
	get isPermanent(): boolean {
		return this[rawDataSymbol].is_permanent;
	}
}
