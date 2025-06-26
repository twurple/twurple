import { Enumerable, mapNullable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelHypeTrainContribution } from './common/EventSubChannelHypeTrainContribution';
import type { EventSubChannelHypeTrainType } from './common/EventSubChannelHypeTrainType';
import { EventSubChannelHypeTrainSharedParticipant } from './common/EventSubChannelHypeTrainSharedParticipant';
import { type EventSubChannelHypeTrainEndV2EventData } from './EventSubChannelHypeTrainEndV2Event.external';

/**
 * An EventSub event representing the end of a Hype train event.
 */
@rtfm<EventSubChannelHypeTrainEndV2Event>('eventsub-base', 'EventSubChannelHypeTrainEndV2Event', 'broadcasterId')
export class EventSubChannelHypeTrainEndV2Event extends DataObject<EventSubChannelHypeTrainEndV2EventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelHypeTrainEndV2EventData, client: ApiClient) {
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
	 * When `true`, {@link EventSubChannelHypeTrainEndV2Event#sharedTrainParticipants} will contain the list of
	 * broadcasters the train is shared with.
	 */
	get isSharedTrain(): boolean {
		return this[rawDataSymbol].is_shared_train;
	}

	/**
	 * The list of broadcasters in the shared Hype Train.
	 *
	 * Empty if {@link EventSubChannelHypeTrainEndV2Event#isSharedTrain} is `false`.
	 */
	get sharedTrainParticipants(): EventSubChannelHypeTrainSharedParticipant[] {
		return (
			mapNullable(this[rawDataSymbol].shared_train_participants, data =>
				data.map(participant => new EventSubChannelHypeTrainSharedParticipant(participant, this._client)),
			) ?? []
		);
	}

	/**
	 * The time when the Hype Train started.
	 */
	get startDate(): Date {
		return new Date(this[rawDataSymbol].started_at);
	}

	/**
	 * The time when the Hype Train ended.
	 */
	get endDate(): Date {
		return new Date(this[rawDataSymbol].ended_at);
	}

	/**
	 * The time when the Hype Train cooldown ends.
	 */
	get cooldownEndDate(): Date {
		return new Date(this[rawDataSymbol].cooldown_ends_at);
	}
}
