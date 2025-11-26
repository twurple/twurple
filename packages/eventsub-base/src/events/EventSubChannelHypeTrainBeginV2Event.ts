import { Enumerable, mapNullable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelHypeTrainContribution } from './common/EventSubChannelHypeTrainContribution.js';
import { type EventSubChannelHypeTrainBeginV2EventData } from './EventSubChannelHypeTrainBeginV2Event.external.js';
import type { EventSubChannelHypeTrainType } from './common/EventSubChannelHypeTrainType.js';
import { EventSubChannelHypeTrainSharedParticipant } from './common/EventSubChannelHypeTrainSharedParticipant.js';

/**
 * An EventSub event representing a Hype Train starting in a channel.
 */
@rtfm<EventSubChannelHypeTrainBeginV2Event>('eventsub-base', 'EventSubChannelHypeTrainBeginV2Event', 'broadcasterId')
export class EventSubChannelHypeTrainBeginV2Event extends DataObject<EventSubChannelHypeTrainBeginV2EventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelHypeTrainBeginV2EventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the Hype Train.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster.
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
	 * The type of the Hype Train.
	 */
	get type(): EventSubChannelHypeTrainType {
		return this[rawDataSymbol].type;
	}

	/**
	 * The level the Hype Train started on.
	 */
	get level(): number {
		return this[rawDataSymbol].level;
	}

	/**
	 * The total points already contributed to the Hype Train.
	 */
	get total(): number {
		return this[rawDataSymbol].total;
	}

	/**
	 * The number of points contributed to the Hype Train at the current level.
	 */
	get progress(): number {
		return this[rawDataSymbol].progress;
	}

	/**
	 * The number of points required to reach the next level.
	 */
	get goal(): number {
		return this[rawDataSymbol].goal;
	}

	/**
	 * The contributors with the most points contributed.
	 */
	get topContributors(): EventSubChannelHypeTrainContribution[] {
		return this[rawDataSymbol].top_contributions.map(
			data => new EventSubChannelHypeTrainContribution(data, this._client),
		);
	}

	/**
	 * Indicates if the Hype Train is shared.
	 *
	 * When `true`, {@link EventSubChannelHypeTrainBeginV2Event#sharedTrainParticipants} will contain the list of
	 * broadcasters the train is shared with.
	 */
	get isSharedTrain(): boolean {
		return this[rawDataSymbol].is_shared_train;
	}

	/**
	 * The list of broadcasters in the shared Hype Train.
	 *
	 * Empty if {@link EventSubChannelHypeTrainBeginV2Event#isSharedTrain} is `false`.
	 */
	get sharedTrainParticipants(): EventSubChannelHypeTrainSharedParticipant[] {
		return (
			mapNullable(this[rawDataSymbol].shared_train_participants, data =>
				data.map(participant => new EventSubChannelHypeTrainSharedParticipant(participant, this._client)),
			) ?? []
		);
	}

	/**
	 * The all-time high level this type of Hype Train has reached for this broadcaster.
	 */
	get allTimeHighLevel(): number {
		return this[rawDataSymbol].all_time_high_level;
	}

	/**
	 * The all-time high total this type of Hype Train has reached for this broadcaster.
	 */
	get allTimeHighTotal(): number {
		return this[rawDataSymbol].all_time_high_total;
	}

	/**
	 * The time when the Hype Train started.
	 */
	get startDate(): Date {
		return new Date(this[rawDataSymbol].started_at);
	}

	/**
	 * The time when the Hype Train is expected to expire, unless a change of level occurs to extend the expiration.
	 */
	get expiryDate(): Date {
		return new Date(this[rawDataSymbol].expires_at);
	}
}
