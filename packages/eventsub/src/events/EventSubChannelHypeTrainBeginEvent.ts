import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { EventSubChannelHypeTrainContribution } from './common/EventSubChannelHypeTrainContribution';

/** @private */
export interface EventSubChannelHypeTrainBeginEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	total: number;
	progress: number;
	goal: number;
	top_contributions: EventSubChannelHypeTrainContribution[];
	last_contribution: EventSubChannelHypeTrainContribution;
	started_at: string;
	expires_at: string;
}

/**
 * An EventSub event representing a Hype Train starting in a channel.
 */
@rtfm<EventSubChannelHypeTrainBeginEvent>('eventsub', 'EventSubChannelHypeTrainBeginEvent', 'broadcasterId')
export class EventSubChannelHypeTrainBeginEvent extends DataObject<EventSubChannelHypeTrainBeginEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelHypeTrainBeginEventData, client: ApiClient) {
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
		return (await this._client.helix.users.getUserById(this[rawDataSymbol].broadcaster_user_id))!;
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
	 * The top contributors for the Hype Train in terms of bits and subscriptions.
	 */
	get topContributors(): EventSubChannelHypeTrainContribution[] {
		return this[rawDataSymbol].top_contributions;
	}

	/**
	 * The last contribution to the Hype Train.
	 */
	get lastContribution(): EventSubChannelHypeTrainContribution {
		return this[rawDataSymbol].last_contribution;
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
