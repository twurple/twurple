import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixGame } from '../game/HelixGame';
import type { HelixUser } from '../user/HelixUser';
import type { HelixVideo } from '../video/HelixVideo';

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

@rtfm<HelixClip>('api', 'HelixClip', 'id')
export class HelixClip extends DataObject<HelixClipData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixClipData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The clip ID.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The URL of the clip.
	 */
	get url(): string {
		return this[rawDataSymbol].url;
	}

	/**
	 * The embed URL of the clip.
	 */
	get embedUrl(): string {
		return this[rawDataSymbol].embed_url;
	}

	/**
	 * The user ID of the broadcaster of the stream where the clip was created.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The display name of the broadcaster of the stream where the clip was created.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * Retrieves information about the broadcaster of the stream where the clip was created.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this[rawDataSymbol].broadcaster_id))!;
	}

	/**
	 * The user ID of the creator of the clip.
	 */
	get creatorId(): string {
		return this[rawDataSymbol].creator_id;
	}

	/**
	 * The display name of the creator of the clip.
	 */
	get creatorDisplayName(): string {
		return this[rawDataSymbol].creator_name;
	}

	/**
	 * Retrieves information about the creator of the clip.
	 */
	async getCreator(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this[rawDataSymbol].creator_id))!;
	}

	/**
	 * The ID of the video the clip is taken from.
	 */
	get videoId(): string {
		return this[rawDataSymbol].video_id;
	}

	/**
	 * Retrieves information about the video the clip is taken from.
	 */
	async getVideo(): Promise<HelixVideo> {
		return (await this._client.helix.videos.getVideoById(this[rawDataSymbol].video_id))!;
	}

	/**
	 * The ID of the game that was being played when the clip was created.
	 */
	get gameId(): string {
		return this[rawDataSymbol].game_id;
	}

	/**
	 * Retrieves information about the game that was being played when the clip was created.
	 */
	async getGame(): Promise<HelixGame> {
		return (await this._client.helix.games.getGameById(this[rawDataSymbol].game_id))!;
	}

	/**
	 * The language of the stream where the clip was created.
	 */
	get language(): string {
		return this[rawDataSymbol].language;
	}

	/**
	 * The title of the clip.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The number of views of the clip.
	 */
	get views(): number {
		return this[rawDataSymbol].view_count;
	}

	/**
	 * The date when the clip was created.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * The URL of the thumbnail of the clip.
	 */
	get thumbnailUrl(): string {
		return this[rawDataSymbol].thumbnail_url;
	}
}
