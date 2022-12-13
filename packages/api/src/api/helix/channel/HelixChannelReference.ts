import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { type HelixChannelReferenceData } from '../../../interfaces/helix/channel.external';
import type { HelixGame } from '../game/HelixGame';
import type { HelixUser } from '../user/HelixUser';
import type { HelixChannel } from './HelixChannel';

/**
 * A reference to a Twitch channel.
 */
@rtfm<HelixChannelReference>('api', 'HelixChannelReference', 'id')
export class HelixChannelReference extends DataObject<HelixChannelReferenceData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixChannelReferenceData, client: ApiClient) {
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
	 * The display name of the channel.
	 */
	get displayName(): string {
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * Retrieves more information about the channel.
	 */
	async getChannel(): Promise<HelixChannel> {
		return (await this._client.channels.getChannelInfoById(this[rawDataSymbol].broadcaster_id))!;
	}

	/**
	 * Retrieves more information about the broadcaster of the channel.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id))!;
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
}
