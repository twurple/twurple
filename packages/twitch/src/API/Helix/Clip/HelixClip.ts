import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixGame } from '../Game/HelixGame';
import type { HelixUser } from '../User/HelixUser';
import type { HelixVideo } from '../Video/HelixVideo';

/** @private */
export interface HelixClipData {
	id: string;
	url: string;
	embed_url: string;
	broadcaster_id: string;
	broadcaster_name: string;
	creator_id: string;
	creator_name: string;
	video_id: string;
	game_id: string;
	language: string;
	title: string;
	view_count: number;
	created_at: string;
	thumbnail_url: string;
}

@rtfm<HelixClip>('twitch', 'HelixClip', 'id')
export class HelixClip {
	@Enumerable(false) private readonly _data: HelixClipData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixClipData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The clip ID.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The URL of the clip.
	 */
	get url(): string {
		return this._data.url;
	}

	/**
	 * The embed URL of the clip.
	 */
	get embedUrl(): string {
		return this._data.embed_url;
	}

	/**
	 * The user ID of the broadcaster of the stream where the clip was created.
	 */
	get broadcasterId(): string {
		return this._data.broadcaster_id;
	}

	/**
	 * The display name of the broadcaster of the stream where the clip was created.
	 */
	get broadcasterDisplayName(): string {
		return this._data.broadcaster_name;
	}

	/**
	 * Retrieves information about the broadcaster of the stream where the clip was created.
	 */
	async getBroadcaster(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.broadcaster_id);
	}

	/**
	 * The user ID of the creator of the clip.
	 */
	get creatorId(): string {
		return this._data.creator_id;
	}

	/**
	 * The display name of the creator of the clip.
	 */
	get creatorDisplayName(): string {
		return this._data.creator_name;
	}

	/**
	 * Retrieves information about the creator of the clip.
	 */
	async getCreator(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.creator_id);
	}

	/**
	 * The ID of the video the clip is taken from.
	 */
	get videoId(): string {
		return this._data.video_id;
	}

	/**
	 * Retrieves information about the video the clip is taken from.
	 */
	async getVideo(): Promise<HelixVideo | null> {
		return this._client.helix.videos.getVideoById(this._data.video_id);
	}

	/**
	 * The ID of the game that was being played when the clip was created.
	 */
	get gameId(): string {
		return this._data.game_id;
	}

	/**
	 * Retrieves information about the game that was being played when the clip was created.
	 */
	async getGame(): Promise<HelixGame | null> {
		return this._client.helix.games.getGameById(this._data.game_id);
	}

	/**
	 * The language of the stream where the clip was created.
	 */
	get language(): string {
		return this._data.language;
	}

	/**
	 * The title of the clip.
	 */
	get title(): string {
		return this._data.title;
	}

	/**
	 * The number of views of the clip.
	 */
	get views(): number {
		return this._data.view_count;
	}

	/**
	 * The date when the clip was created.
	 */
	get creationDate(): Date {
		return new Date(this._data.created_at);
	}

	/**
	 * The URL of the thumbnail of the clip.
	 */
	get thumbnailUrl(): string {
		return this._data.thumbnail_url;
	}
}
