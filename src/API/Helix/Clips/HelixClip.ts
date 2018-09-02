import { NonEnumerable } from '../../../Toolkit/Decorators';
import TwitchClient from '../../../TwitchClient';

export interface HelixClipData {
	id: string;
	url: string;
	embed_url: string;
	broadcaster_id: string;
	creator_id: string;
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

	get id() {
		return this._data.id;
	}

	get url() {
		return this._data.url;
	}

	get embedUrl() {
		return this._data.embed_url;
	}

	get broadcasterId() {
		return this._data.broadcaster_id;
	}

	async getBroadcaster() {
		return this._client.helix.users.getUserById(this._data.broadcaster_id);
	}

	get creatorId() {
		return this._data.creator_id;
	}

	async getCreator() {
		return this._client.helix.users.getUserById(this._data.creator_id);
	}

	get videoId() {
		return this._data.video_id;
	}

	get gameId() {
		return this._data.game_id;
	}

	get language() {
		return this._data.language;
	}

	get views() {
		return this._data.view_count;
	}

	get createdAt() {
		return new Date(this._data.created_at);
	}

	get thumbnailUrl() {
		return this._data.thumbnail_url;
	}
}
