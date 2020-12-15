import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixGame } from '../Game/HelixGame';
import type { HelixTag } from '../Tag/HelixTag';
import type { HelixUser } from '../User/HelixUser';

/** @private */
export interface HelixChannelSearchResultData {
	broadcaster_language: string;
	display_name: string;
	game_id: string;
	id: string;
	is_live: boolean;
	tag_ids: string[];
	thumbnail_url: string;
	title: string;
	started_at: string;
}

/**
 * The result of a channel search.
 */
@rtfm<HelixChannelSearchResult>('twitch', 'HelixChannelSearchResult', 'id')
export class HelixChannelSearchResult {
	@Enumerable(false) private readonly _data: HelixChannelSearchResultData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixChannelSearchResultData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The language of the channel.
	 */
	get language(): string {
		return this._data.broadcaster_language;
	}

	/**
	 * The ID of the channel.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * Retrieves additional information about the owner of the channel.
	 */
	async getUser(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.id);
	}

	/**
	 * The display name of the channel
	 */
	get displayName(): string {
		return this._data.display_name;
	}

	/**
	 * The ID of the game currently played on the channel.
	 */
	get gameId(): string {
		return this._data.game_id;
	}

	/**
	 * Retrieves information about the game that is being played on the stream.
	 */
	async getGame(): Promise<HelixGame | null> {
		return this._client.helix.games.getGameById(this._data.game_id);
	}

	/**
	 * Whether the channel is currently live.
	 */
	get isLive(): boolean {
		return this._data.is_live;
	}

	/**
	 * The IDs of the tags set on the channel.
	 */
	get tagIds(): string[] {
		return this._data.tag_ids;
	}

	/**
	 * Retrieves the tags of the channel.
	 */
	async getTags(): Promise<HelixTag[]> {
		return this._client.helix.tags.getStreamTagsByIds(this._data.tag_ids);
	}

	/**
	 * The thumbnail URL of the stream.
	 */
	get thumbnailUrl(): string {
		return this._data.thumbnail_url;
	}

	/**
	 * The start date of the stream. Returns `null` if the stream is not live.
	 */
	get startDate(): Date | null {
		return this._data.is_live ? new Date(this._data.started_at) : null;
	}
}
