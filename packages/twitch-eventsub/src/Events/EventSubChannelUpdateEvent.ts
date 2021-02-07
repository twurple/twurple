import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixGame, HelixUser } from 'twitch';
import { rtfm } from 'twitch-common';

/** @private */
export interface EventSubChannelUpdateEventData {
	user_id: string;
	user_login: string;
	user_name: string;
	title: string;
	language: string;
	category_id: string;
	category_name: string;
	is_mature: boolean;
}
/**
 * An EventSub event representing a change in channel metadata.
 */
@rtfm<EventSubChannelUpdateEvent>('twitch-eventsub', 'EventSubChannelUpdateEvent', 'userId')
export class EventSubChannelUpdateEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubChannelUpdateEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the user.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The name of the user.
	 */
	get userName(): string {
		return this._data.user_login;
	}

	/**
	 * The display name of the user.
	 */
	get userDisplayName(): string {
		return this._data.user_name;
	}

	/**
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.user_id))!;
	}

	/**
	 * The title of the stream.
	 */
	get streamTitle(): string {
		return this._data.title;
	}

	/**
	 * The language of the stream.
	 */
	get streamLanguage(): string {
		return this._data.language;
	}

	/**
	 * The ID of the game that is currently being played on the channel.
	 */
	get categoryId(): string {
		return this._data.category_id;
	}

	/**
	 * The name of the game that is currently being played on the channel.
	 */
	get categoryName(): string {
		return this._data.category_name;
	}

	/**
	 * Retrieves more information about the game that is currently being played on the channel.
	 */
	async getGame(): Promise<HelixGame> {
		return (await this._client.helix.games.getGameById(this._data.category_id))!;
	}

	/**
	 * Whether the channel is flagged as suitable for mature audiences only.
	 */
	get isMature(): boolean {
		return this._data.is_mature;
	}
}
