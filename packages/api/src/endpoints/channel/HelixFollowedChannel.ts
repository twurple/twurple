import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { BaseApiClient } from '../../client/BaseApiClient';
import type { HelixFollowedChannelData } from '../../interfaces/endpoints/channel.external';
import type { HelixUser } from '../user/HelixUser';

/**
 * Represents a broadcaster that a user follows.
 */
@rtfm<HelixFollowedChannel>('api', 'HelixFollowedChannel', 'broadcasterId')
export class HelixFollowedChannel extends DataObject<HelixFollowedChannelData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixFollowedChannelData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * Gets additional information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id));
	}

	/**
	 * The date when the user followed the broadcaster.
	 */
	get followDate(): Date {
		return new Date(this[rawDataSymbol].followed_at);
	}
}
