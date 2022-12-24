import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../../client/BaseApiClient';
import { type HelixPollData, type HelixPollStatus } from '../../../interfaces/helix/poll.external';
import type { HelixUser } from '../user/HelixUser';
import { HelixPollChoice } from './HelixPollChoice';

/**
 * A channel poll.
 */
@rtfm<HelixPoll>('api', 'HelixPoll', 'id')
export class HelixPoll extends DataObject<HelixPollData> {
	@Enumerable(false) private readonly _client: BaseApiClient;

	/** @private */
	constructor(data: HelixPollData, client: BaseApiClient) {
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
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id));
	}

	/**
	 * The title of the poll.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * Whether voting with channel points is enabled for the poll.
	 */
	get isChannelPointsVotingEnabled(): boolean {
		return this[rawDataSymbol].channel_points_voting_enabled;
	}

	/**
	 * The amount of channel points that a vote costs.
	 */
	get channelPointsPerVote(): number {
		return this[rawDataSymbol].channel_points_per_vote;
	}

	/**
	 * The status of the poll.
	 */
	get status(): HelixPollStatus {
		return this[rawDataSymbol].status;
	}

	/**
	 * The duration of the poll, in seconds.
	 */
	get durationInSeconds(): number {
		return this[rawDataSymbol].duration;
	}

	/**
	 * The date when the poll started.
	 */
	get startDate(): Date {
		return new Date(this[rawDataSymbol].started_at);
	}

	/**
	 * The date when the poll ended or will end.
	 */
	get endDate(): Date {
		return new Date(this.startDate.getTime() + this[rawDataSymbol].duration * 1000);
	}

	/**
	 * The choices of the poll.
	 */
	get choices(): HelixPollChoice[] {
		return this[rawDataSymbol].choices.map(data => new HelixPollChoice(data));
	}
}
