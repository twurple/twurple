import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../user/HelixUser';
import type { HelixPollChoiceData } from './HelixPollChoice';
import { HelixPollChoice } from './HelixPollChoice';

/**
 * The different statuses a poll can have.
 */
type HelixPollStatus = 'ACTIVE' | 'COMPLETED' | 'TERMINATED' | 'ARCHIVED' | 'MODERATED' | 'INVALID';

/** @private */
export interface HelixPollData {
	id: string;
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
	title: string;
	choices: HelixPollChoiceData[];
	bits_voting_enabled: boolean;
	bits_per_vote: number;
	channel_points_voting_enabled: boolean;
	channel_points_per_vote: number;
	status: HelixPollStatus;
	duration: number;
	started_at: string;
}

/**
 * A channel poll.
 */
@rtfm<HelixPoll>('api', 'HelixPoll', 'id')
export class HelixPoll {
	@Enumerable(false) private readonly _data: HelixPollData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixPollData, client: ApiClient) {
		this._data = data;
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
		return this._data.broadcaster_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this._data.broadcaster_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this._data.broadcaster_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.broadcaster_id))!;
	}

	/**
	 * The title of the poll.
	 */
	get title(): string {
		return this._data.title;
	}

	/**
	 * Whether voting with bits is enabled for the poll.
	 */
	get isBitsVotingEnabled(): boolean {
		return this._data.bits_voting_enabled;
	}

	/**
	 * The amount of bits that a vote costs.
	 */
	get bitsPerVote(): number {
		return this._data.bits_per_vote;
	}

	/**
	 * Whether voting with channel points is enabled for the poll.
	 */
	get isChannelPointsVotingEnabled(): boolean {
		return this._data.channel_points_voting_enabled;
	}

	/**
	 * The amount of channel points that a vote costs.
	 */
	get channelPointsPerVote(): number {
		return this._data.channel_points_per_vote;
	}

	/**
	 * The status of the poll.
	 */
	get status(): HelixPollStatus {
		return this._data.status;
	}

	/**
	 * The duration of the poll, in seconds.
	 */
	get durationInSeconds(): number {
		return this._data.duration;
	}

	/**
	 * The date when the poll started.
	 */
	get startDate(): Date {
		return new Date(this._data.started_at);
	}

	/**
	 * The date when the poll ended or will end.
	 */
	get endDate(): Date {
		return new Date(this.startDate.getTime() + this._data.duration * 1000);
	}

	/**
	 * The choices of the poll.
	 */
	get choices(): HelixPollChoice[] {
		return this._data.choices.map(data => new HelixPollChoice(data));
	}
}
