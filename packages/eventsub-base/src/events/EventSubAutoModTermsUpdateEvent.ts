import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type EventSubAutoModTermsUpdateAction,
	type EventSubAutoModTermsUpdateEventData,
} from './EventSubAutoModTermsUpdateEvent.external';

/**
 * An EventSub event representing AutoMod terms being updated in a channel.
 */
@rtfm<EventSubAutoModTermsUpdateEvent>('eventsub-base', 'EventSubAutoModTermsUpdateEvent', 'broadcasterId')
export class EventSubAutoModTermsUpdateEvent extends DataObject<EventSubAutoModTermsUpdateEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubAutoModTermsUpdateEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the broadcaster in whose channel AutoMod terms were updated.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster in whose channel AutoMod terms were updated.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster in whose channel AutoMod terms were updated.
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
	 * The ID of the moderator who updated AutoMod terms.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].moderator_user_id;
	}

	/**
	 * The name of the moderator who updated AutoMod terms.
	 */
	get moderatorName(): string {
		return this[rawDataSymbol].moderator_user_login;
	}

	/**
	 * The display name of the moderator who updated AutoMod terms.
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
	 * The status change applied to the terms.
	 */
	get action(): EventSubAutoModTermsUpdateAction {
		return this[rawDataSymbol].action;
	}

	/**
	 * Indicates whether this term was added due to an AutoMod message resolution action.
	 */
	get fromAutoMod(): boolean {
		return this[rawDataSymbol].from_automod;
	}

	/**
	 * The list of terms that had a status change.
	 */
	get terms(): string[] {
		return this[rawDataSymbol].terms;
	}
}
