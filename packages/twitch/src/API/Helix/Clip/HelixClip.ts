import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from '../../../TwitchClient';

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

export default class HelixClip {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: HelixClipData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The clip ID.
	 */
	get id() {
		return this._data.id;
	}

	/**
	 * The URL of the clip.
	 */
	get url() {
		return this._data.url;
	}

	/**
	 * The embed URL of the clip.
	 */
	get embedUrl() {
		return this._data.embed_url;
	}

	/**
	 * The user ID of the broadcaster of the stream where the clip was created.
	 */
	get broadcasterId() {
		return this._data.broadcaster_id;
	}

	/**
	 * The display name of the broadcaster of the stream where the clip was created.
	 */
	get broadcasterDisplayName() {
		return this._data.broadcaster_name;
	}

	/**
	 * Retrieves information about the broadcaster of the stream where the clip was created.
	 */
	async getBroadcaster() {
		return this._client.helix.users.getUserById(this._data.broadcaster_id);
	}

	/**
	 * The user ID of the creator of the clip.
	 */
	get creatorId() {
		return this._data.creator_id;
	}

	/**
	 * The display name of the creator of the clip.
	 */
	get creatorDisplayName() {
		return this._data.creator_name;
	}

	/**
	 * Retrieves information about the creator of the clip.
	 */
	async getCreator() {
		return this._client.helix.users.getUserById(this._data.creator_id);
	}

	/**
	 * The ID of the video the clip is taken from.
	 */
	get videoId() {
		return this._data.video_id;
	}

	/**
	 * Retrieves information about the video the clip is taken from.
	 */
	async getVideo() {
		return this._client.helix.videos.getVideoById(this._data.video_id);
	}

	/**
	 * The ID of the game that was being played when the clip was created.
	 */
	get gameId() {
		return this._data.game_id;
	}

	/**
	 * Retrieves information about the game that was being played when the clip was created.
	 */
	async getGame() {
		return this._client.helix.games.getGameById(this._data.game_id);
	}

	/**
	 * The language of the stream where the clip was created.
	 */
	get language() {
		return this._data.language;
	}

	/**
	 * The title of the clip.
	 */
	get title() {
		return this._data.title;
	}

	/**
	 * The number of views of the clip.
	 */
	get views() {
		return this._data.view_count;
	}

	/**
	 * The date when the clip was created.
	 */
	get creationDate() {
		return new Date(this._data.created_at);
	}

	/**
	 * The URL of the thumbnail of the clip.
	 */
	get thumbnailUrl() {
		return this._data.thumbnail_url;
	}
}
