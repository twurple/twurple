import { Enumerable } from '@d-fischer/shared-utils';
import { type ApiClient, type HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubChannelHypeTrainSharedParticipantData } from './EventSubChannelHypeTrainSharedParticipant.external.js';

/**
 * The broadcaster participating in the shared Hype Train.
 */
@rtfm<EventSubChannelHypeTrainSharedParticipant>(
	'eventsub-base',
	'EventSubChannelHypeTrainSharedParticipant',
	'broadcasterId',
)
export class EventSubChannelHypeTrainSharedParticipant extends DataObject<EventSubChannelHypeTrainSharedParticipantData> {
	/** @internal */ @Enumerable(false) private readonly _client?: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelHypeTrainSharedParticipantData, client?: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the broadcaster participating in the shared Hype Train.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster participating in the shared Hype Train.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster participating in the shared Hype Train.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		if (!this._client) {
			throw new Error(
				'EventSubChannelHypeTrainSharedParticipant#getBroadcaster is not supported in this context',
			);
		}
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}
}
