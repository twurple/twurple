import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { EventSubChannelShieldModeBeginEventData } from './EventSubChannelShieldModeBeginEvent.external';

/**
 * An EventSub event representing Shield Mode being activated on a broadcaster's channel.
 */
@rtfm('eventsub-base', 'EventSubChannelShieldModeBeginEvent')
export class EventSubChannelShieldModeBeginEvent extends DataObject<EventSubChannelShieldModeBeginEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelShieldModeBeginEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the broadcaster on whose channel Shield Mode was activated.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster on whose channel Shield Mode was activated.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster on whose channel Shield Mode was activated.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id))!;
	}

	/**
	 * The ID of the moderator who activated Shield Mode.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].moderator_user_id;
	}

	/**
	 * The name of the moderator who activated Shield Mode.
	 */
	get moderatorName(): string {
		return this[rawDataSymbol].moderator_user_login;
	}

	/**
	 * The display name of the moderator who activated Shield Mode
	 */
	get moderatorDisplayName(): string {
		return this[rawDataSymbol].moderator_user_name;
	}

	/**
	 * Retrieves more information about the moderator.
	 */
	async getModerator(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].moderator_user_id))!;
	}

	/**
	 * The date when Shield Mode was activated.
	 */
	get startDate(): Date {
		return new Date(this[rawDataSymbol].started_at);
	}
}
