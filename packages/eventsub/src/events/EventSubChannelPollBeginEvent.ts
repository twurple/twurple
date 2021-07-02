import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { EventSubChannelPollBeginChoiceData } from './common/EventSubChannelPollBeginChoice';
import { EventSubChannelPollBeginChoice } from './common/EventSubChannelPollBeginChoice';
import type { EventSubChannelPollVoteTypeSettingsData } from './common/EventSubChannelPollVoteTypeSettingsData';

/** @private */
export interface EventSubChannelPollBeginEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	title: string;
	choices: EventSubChannelPollBeginChoiceData[];
	bits_voting: EventSubChannelPollVoteTypeSettingsData;
	channel_points_voting: EventSubChannelPollVoteTypeSettingsData;
	started_at: string;
	ends_at: string;
}

/**
 * An EventSub event representing a poll starting in a channel.
 */
@rtfm<EventSubChannelPollBeginEvent>('eventsub', 'EventSubChannelPollBeginEvent', 'broadcasterId')
export class EventSubChannelPollBeginEvent extends DataObject<EventSubChannelPollBeginEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelPollBeginEventData, client: ApiClient) {
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
		return (await this._client.helix.users.getUserById(this[rawDataSymbol].broadcaster_user_id))!;
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
	get choices(): EventSubChannelPollBeginChoice[] {
		return this[rawDataSymbol].choices.map(data => new EventSubChannelPollBeginChoice(data));
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
	 * The time when the poll ends.
	 */
	get endDate(): Date {
		return new Date(this[rawDataSymbol].ends_at);
	}
}
