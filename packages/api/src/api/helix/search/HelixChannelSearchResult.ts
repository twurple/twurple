import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { type HelixChannelSearchResultData } from '../../../interfaces/helix/search.external';
import type { HelixGame } from '../game/HelixGame';
import type { HelixTag } from '../tag/HelixTag';
import type { HelixUser } from '../user/HelixUser';

/**
 * The result of a channel search.
 */
@rtfm<HelixChannelSearchResult>('api', 'HelixChannelSearchResult', 'id')
export class HelixChannelSearchResult extends DataObject<HelixChannelSearchResultData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixChannelSearchResultData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The language of the channel.
	 */
	get language(): string {
		return this[rawDataSymbol].broadcaster_language;
	}

	/**
	 * The ID of the channel.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The name of the channel.
	 */
	get name(): string {
		return this[rawDataSymbol].broadcaster_login;
	}

	/**
	 * The display name of the channel.
	 */
	get displayName(): string {
		return this[rawDataSymbol].display_name;
	}

	/**
	 * Retrieves additional information about the owner of the channel.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].id))!;
	}

	/**
	 * The ID of the game currently played on the channel.
	 */
	get gameId(): string {
		return this[rawDataSymbol].game_id;
	}

	/**
	 * The name of the game currently played on the channel.
	 */
	get gameName(): string {
		return this[rawDataSymbol].game_name;
	}

	/**
	 * Retrieves information about the game that is being played on the stream.
	 */
	async getGame(): Promise<HelixGame> {
		return (await this._client.games.getGameById(this[rawDataSymbol].game_id))!;
	}

	/**
	 * Whether the channel is currently live.
	 */
	get isLive(): boolean {
		return this[rawDataSymbol].is_live;
	}

	/**
	 * The IDs of the tags set on the channel.
	 *
	 * @deprecated
	 */
	get tagIds(): string[] {
		return this[rawDataSymbol].tag_ids;
	}

	/**
	 * Retrieves the tags of the channel.
	 *
	 * @deprecated
	 */
	async getTags(): Promise<HelixTag[]> {
		return await this._client.tags.getStreamTagsByIds(this[rawDataSymbol].tag_ids);
	}

	/**
	 * The tags applied to the channel.
	 */
	get tags(): string[] {
		return this[rawDataSymbol].tags;
	}

	/**
	 * The thumbnail URL of the stream.
	 */
	get thumbnailUrl(): string {
		return this[rawDataSymbol].thumbnail_url;
	}

	/**
	 * The start date of the stream. Returns `null` if the stream is not live.
	 */
	get startDate(): Date | null {
		return this[rawDataSymbol].is_live ? new Date(this[rawDataSymbol].started_at) : null;
	}
}
