import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubChannelHypeTrainSharedParticipantData } from './EventSubChannelHypeTrainSharedParticipant.external';
import { type ApiClient, type HelixUser } from '@twurple/api';

/**
 * The broadcaster participating in the shared Hype Train.
 */
@rtfm<EventSubChannelHypeTrainSharedParticipant>(
	'eventsub-base',
	'EventSubChannelHypeTrainSharedParticipant',
	'broadcasterId',
)
export class EventSubChannelHypeTrainSharedParticipant extends DataObject<EventSubChannelHypeTrainSharedParticipantData> {
	constructor(data: EventSubChannelHypeTrainSharedParticipantData, private readonly _client: ApiClient) {
		super(data);
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
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}
}
