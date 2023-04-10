import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient';
import { type HelixStreamData, type HelixStreamType } from '../../interfaces/endpoints/stream.external';
import type { HelixGame } from '../game/HelixGame';
import type { HelixUser } from '../user/HelixUser';

/**
 * A Twitch stream.
 */
@rtfm<HelixStream>('api', 'HelixStream', 'id')
export class HelixStream extends DataObject<HelixStreamData> {
	@Enumerable(false) private readonly _client: BaseApiClient;

	/** @private */
	constructor(data: HelixStreamData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The stream ID.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The user ID.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The user's name.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The user's display name.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets information about the user broadcasting the stream.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The game ID, or an empty string if the stream doesn't currently have a game.
	 */
	get gameId(): string {
		return this[rawDataSymbol].game_id;
	}

	/**
	 * The game name, or an empty string if the stream doesn't currently have a game.
	 */
	get gameName(): string {
		return this[rawDataSymbol].game_name;
	}

	/**
	 * Gets information about the game that is being played on the stream.
	 *
	 * Returns null if the stream doesn't currently have a game.
	 */
	async getGame(): Promise<HelixGame | null> {
		return this[rawDataSymbol].game_id
			? checkRelationAssertion(await this._client.games.getGameById(this[rawDataSymbol].game_id))
			: null;
	}

	/**
	 * The type of the stream.
	 */
	get type(): HelixStreamType {
		return this[rawDataSymbol].type;
	}

	/**
	 * The title of the stream.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The number of viewers the stream currently has.
	 */
	get viewers(): number {
		return this[rawDataSymbol].viewer_count;
	}

	/**
	 * The time when the stream started.
	 */
	get startDate(): Date {
		return new Date(this[rawDataSymbol].started_at);
	}

	/**
	 * The language of the stream.
	 */
	get language(): string {
		return this[rawDataSymbol].language;
	}

	/**
	 * The URL of the thumbnail of the stream.
	 *
	 * This URL includes the placeholders `{width}` and `{height}`
	 * which you must replace with the desired dimensions of the thumbnail (in pixels).
	 *
	 * You can also use {@link HelixStream#getThumbnailUrl} to do this replacement.
	 */
	get thumbnailUrl(): string {
		return this[rawDataSymbol].thumbnail_url;
	}

	/**
	 * Builds the thumbnail URL of the stream using the given dimensions.
	 *
	 * @param width The width of the thumbnail.
	 * @param height The height of the thumbnail.
	 */
	getThumbnailUrl(width: number, height: number): string {
		return this[rawDataSymbol].thumbnail_url
			.replace('{width}', width.toString())
			.replace('{height}', height.toString());
	}

	/**
	 * The tags applied to the stream.
	 */
	get tags(): string[] {
		return this[rawDataSymbol].tags;
	}

	/**
	 * Whether the stream is set to be targeted to mature audiences only.
	 */
	get isMature(): boolean {
		return this[rawDataSymbol].is_mature;
	}
}
