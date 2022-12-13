import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixGame, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubChannelUpdateEventData } from './EventSubChannelUpdateEvent.external';

/**
 * An EventSub event representing a change in channel metadata.
 */
@rtfm<EventSubChannelUpdateEvent>('eventsub-base', 'EventSubChannelUpdateEvent', 'broadcasterId')
export class EventSubChannelUpdateEvent extends DataObject<EventSubChannelUpdateEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelUpdateEventData, client: ApiClient) {
		super(data);
		this._client = client;
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
	 * The title of the stream.
	 */
	get streamTitle(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The language of the stream.
	 */
	get streamLanguage(): string {
		return this[rawDataSymbol].language;
	}

	/**
	 * The ID of the game that is currently being played on the channel.
	 */
	get categoryId(): string {
		return this[rawDataSymbol].category_id;
	}

	/**
	 * The name of the game that is currently being played on the channel.
	 */
	get categoryName(): string {
		return this[rawDataSymbol].category_name;
	}

	/**
	 * Retrieves more information about the game that is currently being played on the channel.
	 */
	async getGame(): Promise<HelixGame> {
		return (await this._client.games.getGameById(this[rawDataSymbol].category_id))!;
	}

	/**
	 * Whether the channel is flagged as suitable for mature audiences only.
	 */
	get isMature(): boolean {
		return this[rawDataSymbol].is_mature;
	}
}
