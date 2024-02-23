import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { BaseApiClient } from '../../client/BaseApiClient';
import type { HelixModeratedChannelData } from '../../interfaces/endpoints/moderation.external';
import type { HelixUser } from '../user/HelixUser';
import type { HelixChannel } from '../channel/HelixChannel';

/**
 * A reference to a Twitch channel where a user is a moderator.
 */
@rtfm<HelixModeratedChannel>('api', 'HelixModeratedChannel', 'id')
export class HelixModeratedChannel extends DataObject<HelixModeratedChannelData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixModeratedChannelData, client: BaseApiClient) {
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
	 * Gets more information about the channel.
	 */
	async getChannel(): Promise<HelixChannel> {
		return checkRelationAssertion(
			await this._client.channels.getChannelInfoById(this[rawDataSymbol].broadcaster_id),
		);
	}

	/**
	 * Gets more information about the broadcaster of the channel.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id));
	}
}
