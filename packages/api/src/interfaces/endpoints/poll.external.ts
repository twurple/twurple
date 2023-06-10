import { extractUserId, type UserIdResolvable } from '@twurple/common';
import { type HelixCreatePollData } from './poll.input';

/**
 * The different statuses a poll can have.
 */
export type HelixPollStatus = 'ACTIVE' | 'COMPLETED' | 'TERMINATED' | 'ARCHIVED' | 'MODERATED' | 'INVALID';

/** @private */
export interface HelixPollChoiceData {
	id: string;
	title: string;
	votes: number;
	channel_points_votes: number;
	bits_votes: number;
}

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

/** @internal */
export function createPollBody(broadcaster: UserIdResolvable, data: HelixCreatePollData) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		title: data.title,
		choices: data.choices.map(title => ({ title })),
		duration: data.duration,
		channel_points_voting_enabled: data.channelPointsPerVote != null,
		channel_points_per_vote: data.channelPointsPerVote ?? 0
	};
}

/** @internal */
export function createPollEndBody(broadcaster: UserIdResolvable, id: string, showResult: boolean) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		id,
		status: showResult ? 'TERMINATED' : 'ARCHIVED'
	};
}
