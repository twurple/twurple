import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { type HelixChannelData } from '../../../interfaces/helix/channel.external';
import type { HelixGame } from '../game/HelixGame';
import type { HelixUser } from '../user/HelixUser';

/**
 * A Twitch channel.
 */
@rtfm<HelixChannel>('api', 'HelixChannel', 'id')
export class HelixChannel extends DataObject<HelixChannelData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixChannelData, client: ApiClient) {
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
	 * Retrieves more information about the broadcaster of the channel.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id))!;
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
	 * Retrieves information about the game that is being played on the stream.
	 */
	async getGame(): Promise<HelixGame> {
		return (await this._client.games.getGameById(this[rawDataSymbol].game_id))!;
	}

	/**
	 * The title of the channel.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The stream delay of the channel, in seconds.
	 */
	get delay(): number {
		return this[rawDataSymbol].delay;
	}
}
