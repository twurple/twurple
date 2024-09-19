import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubChannelSuspiciousUserUpdateEventData } from './EventSubChannelSuspiciousUserUpdateEvent.external';
import type { EventSubChannelSuspiciousUserLowTrustStatus } from './common/EventSubChannelSuspiciousUserLowTrustStatus';

/**
 * An EventSub event representing a suspicious user being updated in a channel.
 */
@rtfm<EventSubChannelSuspiciousUserUpdateEvent>(
	'eventsub-base',
	'EventSubChannelSuspiciousUserUpdateEvent',
	'broadcasterId',
)
export class EventSubChannelSuspiciousUserUpdateEvent extends DataObject<EventSubChannelSuspiciousUserUpdateEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelSuspiciousUserUpdateEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the channel where the treatment for a suspicious user was updated.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the channel where the treatment for a suspicious user was updated.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the channel where the treatment for a suspicious user was updated.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * The ID of the moderator that updated the treatment for a suspicious user.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].moderator_user_id;
	}

	/**
	 * The name of the moderator that updated the treatment for a suspicious user.
	 */
	get moderatorName(): string {
		return this[rawDataSymbol].moderator_user_login;
	}

	/**
	 * The display name of the moderator that updated the treatment for a suspicious user.
	 */
	get moderatorDisplayName(): string {
		return this[rawDataSymbol].moderator_user_name;
	}

	/**
	 * Gets more information about the moderator.
	 */
	async getModerator(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].moderator_user_id));
	}

	/**
	 * The ID of the suspicious user whose treatment was updated.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the suspicious user whose treatment was updated.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the suspicious user whose treatment was updated.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets more information about the user whose treatment was updated.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The status set for the suspicious user.
	 */
	get lowTrustStatus(): EventSubChannelSuspiciousUserLowTrustStatus {
		return this[rawDataSymbol].low_trust_status;
	}
}
