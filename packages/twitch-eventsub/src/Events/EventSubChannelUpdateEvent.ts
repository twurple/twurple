import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';

/** @private */
export interface EventSubChannelUpdateEventData {
	user_id: string;
	user_name: string;
	title: string;
	language: string;
	category_id: string;
	category_name: string;
	isMature: boolean;
}
/**
 * An EventSub Event representing a change in channel metadata
 */
export class EventSubChannelUpdateEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubChannelUpdateEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The User ID of channel
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The display name of the user
	 */
	get userDisplayName(): string {
		return this._data.user_name;
	}

	/**
	 * Retrieves more information about the user
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.user_id!))!;
	}

	/**
	 * The title of the channel
	 */
	get streamTitle(): string {
		return this._data.title;
	}

	/**
	 * The language of the channel
	 */
	get streamLanguage(): string {
		return this._data.language;
	}

	/**
	 * The ID of the Category the channel is under
	 */
	get categoryId(): string {
		return this._data.category_id;
	}

	/**
	 * The name of the Category the channel is under
	 */
	get categoryName(): string {
		return this._data.category_name;
	}

	/**
	 * Whether the channel is flagged as mature
	 */
	get isMature(): boolean {
		return this._data.isMature;
	}
}
