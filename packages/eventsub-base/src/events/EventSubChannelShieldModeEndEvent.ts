import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { EventSubChannelShieldModeEndEventData } from './EventSubChannelShieldModeEndEvent.external';

/**
 * An EventSub event representing Shield Mode being deactivated on a broadcaster's channel.
 *
 * @beta
 */
@rtfm('eventsub-base', 'EventSubChannelShieldModeEndEvent')
export class EventSubChannelShieldModeEndEvent extends DataObject<EventSubChannelShieldModeEndEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelShieldModeEndEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the broadcaster on whose channel Shield Mode was deactivated.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster on whose channel Shield Mode was deactivated.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster on whose channel Shield Mode was deactivated.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * The ID of the moderator who deactivated Shield Mode.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].moderator_user_id;
	}

	/**
	 * The name of the moderator who deactivated Shield Mode.
	 */
	get moderatorName(): string {
		return this[rawDataSymbol].moderator_user_login;
	}

	/**
	 * The display name of the moderator who deactivated Shield Mode
	 */
	get moderatorDisplayName(): string {
		return this[rawDataSymbol].moderator_user_name;
	}

	/**
	 * Retrieves more information about the moderator.
	 */
	async getModerator(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].moderator_user_id));
	}

	/**
	 * The date when Shield Mode was deactivated.
	 */
	get endDate(): Date {
		return new Date(this[rawDataSymbol].ended_at);
	}
}
