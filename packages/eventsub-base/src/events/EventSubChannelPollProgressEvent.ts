import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelPollChoice } from './common/EventSubChannelPollChoice';
import { type EventSubChannelPollProgressEventData } from './EventSubChannelPollProgressEvent.external';

/**
 * An EventSub event representing a poll starting in a channel.
 */
@rtfm<EventSubChannelPollProgressEvent>('eventsub-base', 'EventSubChannelPollProgressEvent', 'broadcasterId')
export class EventSubChannelPollProgressEvent extends DataObject<EventSubChannelPollProgressEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelPollProgressEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the poll.
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
	 * The title of the poll.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The choices of the poll.
	 */
	get choices(): EventSubChannelPollChoice[] {
		return this[rawDataSymbol].choices.map(data => new EventSubChannelPollChoice(data));
	}

	/**
	 * Whether voting with bits is enabled.
	 */
	get isBitsVotingEnabled(): boolean {
		return this[rawDataSymbol].bits_voting.is_enabled;
	}

	/**
	 * The amount of bits a vote costs.
	 */
	get bitsPerVote(): number {
		return this[rawDataSymbol].bits_voting.amount_per_vote;
	}

	/**
	 * Whether voting with channel points is enabled.
	 */
	get isChannelPointsVotingEnabled(): boolean {
		return this[rawDataSymbol].channel_points_voting.is_enabled;
	}

	/**
	 * The amount of channel points a vote costs.
	 */
	get channelPointsPerVote(): number {
		return this[rawDataSymbol].channel_points_voting.amount_per_vote;
	}

	/**
	 * The time when the poll started.
	 */
	get startDate(): Date {
		return new Date(this[rawDataSymbol].started_at);
	}

	/**
	 * The time when the poll ended.
	 */
	get endDate(): Date {
		return new Date(this[rawDataSymbol].ends_at);
	}
}
