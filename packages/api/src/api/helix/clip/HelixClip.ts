import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../../client/BaseApiClient';
import { type HelixClipData } from '../../../interfaces/helix/clip.external';
import type { HelixGame } from '../game/HelixGame';
import type { HelixUser } from '../user/HelixUser';
import type { HelixVideo } from '../video/HelixVideo';

@rtfm<HelixClip>('api', 'HelixClip', 'id')
export class HelixClip extends DataObject<HelixClipData> {
	@Enumerable(false) private readonly _client: BaseApiClient;

	/** @private */
	constructor(data: HelixClipData, client: BaseApiClient) {
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
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id));
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
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].creator_id));
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
		return checkRelationAssertion(await this._client.videos.getVideoById(this[rawDataSymbol].video_id));
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
	async getGame(): Promise<HelixGame | null> {
		return this[rawDataSymbol].game_id
			? checkRelationAssertion(await this._client.games.getGameById(this[rawDataSymbol].game_id))
			: null;
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

	/**
	 * The duration of the clip in seconds (up to 0.1 precision).
	 */
	get duration(): number {
		return this[rawDataSymbol].duration;
	}

	/**
	 * The offset of the clip from the start of the corresponding VOD, in seconds.
	 *
	 * This may be null if there is no VOD or if the clip is created from a live broadcast,
	 * in which case it may take a few minutes to associate with the VOD.
	 */
	get vodOffset(): number | null {
		return this[rawDataSymbol].vod_offset;
	}
}
