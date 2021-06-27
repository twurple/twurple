import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubChannelPollBeginChoiceData } from './Common/EventSubChannelPollBeginChoice';
import { EventSubChannelPollBeginChoice } from './Common/EventSubChannelPollBeginChoice';
import type { EventSubChannelPollVoteTypeSettingsData } from './Common/EventSubChannelPollVoteTypeSettingsData';

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
@rtfm<EventSubChannelPollBeginEvent>('twitch-eventsub', 'EventSubChannelPollBeginEvent', 'broadcasterId')
export class EventSubChannelPollBeginEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubChannelPollBeginEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the poll.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this._data.broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this._data.broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this._data.broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.broadcaster_user_id))!;
	}

	/**
	 * The title of the poll.
	 */
	get title(): string {
		return this._data.title;
	}

	/**
	 * The choices of the poll.
	 */
	get choices(): EventSubChannelPollBeginChoice[] {
		return this._data.choices.map(data => new EventSubChannelPollBeginChoice(data));
	}

	/**
	 * Whether voting with bits is enabled.
	 */
	get isBitsVotingEnabled(): boolean {
		return this._data.bits_voting.is_enabled;
	}

	/**
	 * The amount of bits a vote costs.
	 */
	get bitsPerVote(): number {
		return this._data.bits_voting.amount_per_vote;
	}

	/**
	 * Whether voting with channel points is enabled.
	 */
	get isChannelPointsVotingEnabled(): boolean {
		return this._data.channel_points_voting.is_enabled;
	}

	/**
	 * The amount of channel points a vote costs.
	 */
	get channelPointsPerVote(): number {
		return this._data.channel_points_voting.amount_per_vote;
	}

	/**
	 * The time when the poll started.
	 */
	get startDate(): Date {
		return new Date(this._data.started_at);
	}

	/**
	 * The time when the poll ends.
	 */
	get endDate(): Date {
		return new Date(this._data.ends_at);
	}
}
