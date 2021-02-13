import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixGame } from '../Game/HelixGame';
import type { HelixTag } from '../Tag/HelixTag';
import type { HelixUser } from '../User/HelixUser';

/**
 * The type of a stream.
 */
export enum HelixStreamType {
	/**
	 * Returned by Twitch in case of an error.
	 */
	None = '',

	/**
	 * A live stream.
	 */
	Live = 'live',

	/**
	 * A vodcast.
	 *
	 * Currently not supported by Twitch - but one can only hope and leave it in here.
	 */
	Vodcast = 'vodcast'
}

/** @private */
export interface HelixStreamData {
	id: string;
	user_id: string;
	user_login: string;
	user_name: string;
	game_id: string;
	community_ids: string[];
	type: HelixStreamType;
	title: string;
	viewer_count: number;
	started_at: string;
	language: string;
	thumbnail_url: string;
	tag_ids: string[] | null;
}

/**
 * A Twitch stream.
 */
@rtfm<HelixStream>('twitch', 'HelixStream', 'id')
export class HelixStream {
	@Enumerable(false) private readonly _data: HelixStreamData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixStreamData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The stream ID.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The user ID.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The user's name.
	 */
	get userName(): string {
		return this._data.user_login;
	}

	/**
	 * The user's display name.
	 */
	get userDisplayName(): string {
		return this._data.user_name;
	}

	/**
	 * Retrieves information about the user broadcasting the stream.
	 */
	async getUser(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.user_id);
	}

	/**
	 * The game ID.
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
	 * The type of the stream.
	 */
	get type(): HelixStreamType {
		return this._data.type;
	}

	/**
	 * The title of the stream.
	 */
	get title(): string {
		return this._data.title;
	}

	/**
	 * The number of viewers the stream currently has.
	 */
	get viewers(): number {
		return this._data.viewer_count;
	}

	/**
	 * The time when the stream started.
	 */
	get startDate(): Date {
		return new Date(this._data.started_at);
	}

	/**
	 * The language of the stream.
	 */
	get language(): string {
		return this._data.language;
	}

	/**
	 * The URL of the thumbnail of the stream.
	 */
	get thumbnailUrl(): string {
		return this._data.thumbnail_url;
	}

	/**
	 * Builds the thumbnail URL of the stream using the given dimensions.
	 *
	 * @param width The width of the thumbnail.
	 * @param height The height of the thumbnail.
	 */
	getThumbnailUrl(width: number, height: number): string {
		return this._data.thumbnail_url.replace('{width}', width.toString()).replace('{height}', height.toString());
	}

	/**
	 * The IDs of the tags of the stream.
	 */
	get tagIds(): string[] {
		return this._data.tag_ids ?? [];
	}

	/**
	 * Retrieves the tags of the stream.
	 */
	async getTags(): Promise<HelixTag[]> {
		return this._client.helix.tags.getStreamTagsByIds(this._data.tag_ids ?? []);
	}
}
