import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { EventSubChannelHypeTrainContributionData } from './common/EventSubChannelHypeTrainContribution';
import { EventSubChannelHypeTrainContribution } from './common/EventSubChannelHypeTrainContribution';

/** @private */
export interface EventSubChannelHypeTrainEndEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	level: number;
	total: number;
	top_contributions: EventSubChannelHypeTrainContributionData[] | null;
	started_at: string;
	ended_at: string;
	cooldown_ends_at: string;
}

/**
 * An EventSub event representing the end of a Hype train event.
 */
@rtfm<EventSubChannelHypeTrainEndEvent>('eventsub', 'EventSubChannelHypeTrainEndEvent', 'broadcasterId')
export class EventSubChannelHypeTrainEndEvent extends DataObject<EventSubChannelHypeTrainEndEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelHypeTrainEndEventData, client: ApiClient) {
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
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id))!;
	}

	/**
	 * The level the Hype Train ended on.
	 */
	get level(): number {
		return this[rawDataSymbol].level;
	}

	/**
	 * The total points contributed to the Hype Train.
	 */
	get total(): number {
		return this[rawDataSymbol].total;
	}

	/**
	 * The contributors with the most points, for both bits and subscriptions.
	 */
	get topContributors(): EventSubChannelHypeTrainContribution[] {
		return (
			this[rawDataSymbol].top_contributions?.map(
				data => new EventSubChannelHypeTrainContribution(data, this._client)
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
