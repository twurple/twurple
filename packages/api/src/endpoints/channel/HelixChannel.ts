import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient.js';
import { type HelixChannelData } from '../../interfaces/endpoints/channel.external.js';
import type { HelixGame } from '../game/HelixGame.js';
import type { HelixUser } from '../user/HelixUser.js';

/**
 * A Twitch channel.
 */
@rtfm<HelixChannel>('api', 'HelixChannel', 'id')
export class HelixChannel extends DataObject<HelixChannelData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixChannelData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the channel.
	 */
	get id(): string {
		return this[rawDataSymbol].broadcaster_id;
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
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * Gets more information about the broadcaster of the channel.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id));
	}

	/**
	 * The language of the channel.
	 */
	get language(): string {
		return this[rawDataSymbol].broadcaster_language;
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
	 * Gets information about the game that is being played on the stream.
	 */
	async getGame(): Promise<HelixGame | null> {
		return this[rawDataSymbol].game_id
			? checkRelationAssertion(await this._client.games.getGameById(this[rawDataSymbol].game_id))
			: null;
	}

	/**
	 * The title of the channel.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The stream delay of the channel, in seconds.
	 *
	 * If you didn't request this with broadcaster access, this is always zero.
	 */
	get delay(): number {
		return this[rawDataSymbol].delay;
	}

	/**
	 * The tags applied to the channel.
	 */
	get tags(): string[] {
		return this[rawDataSymbol].tags;
	}

	/**
	 * The content classification labels applied to the channel.
	 */
	get contentClassificationLabels(): string[] {
		return this[rawDataSymbol].content_classification_labels;
	}

	/**
	 * Whether the channel currently displays branded content (as specified by the broadcaster).
	 */
	get isBrandedContent(): boolean {
		return this[rawDataSymbol].is_branded_content;
	}
}
