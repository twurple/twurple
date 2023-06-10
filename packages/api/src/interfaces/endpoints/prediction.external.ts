import { extractUserId, type UserIdResolvable } from '@twurple/common';
import { type HelixCreatePredictionData } from './prediction.input';

/**
 * The different statuses a prediction can have.
 */
export type HelixPredictionStatus = 'ACTIVE' | 'RESOLVED' | 'CANCELED' | 'LOCKED';

export type HelixPredictionOutcomeColor = 'BLUE' | 'PINK';

/** @private */
export interface HelixPredictorData {
	id: string;
	name: string;
	login: string;
	channel_points_used: number;
	channel_points_won: number | null;
}

/** @private */
export interface HelixPredictionOutcomeData {
	id: string;
	title: string;
	users: number;
	channel_points: number;
	top_predictors: HelixPredictorData[] | null;
	color: HelixPredictionOutcomeColor;
}

/** @private */
export interface HelixPredictionData {
	id: string;
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
	title: string;
	winning_outcome_id: string | null;
	outcomes: HelixPredictionOutcomeData[];
	prediction_window: number;
	status: HelixPredictionStatus;
	created_at: string;
	ended_at: string;
	locked_at: string;
}

/** @internal */
export function createPredictionBody(broadcaster: UserIdResolvable, data: HelixCreatePredictionData) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		title: data.title,
		outcomes: data.outcomes.map(title => ({ title })),
		prediction_window: data.autoLockAfter
	};
}

/** @internal */
export function createEndPredictionBody(
	broadcaster: UserIdResolvable,
	id: string,
	status: HelixPredictionStatus,
	outcomeId?: string
) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		id,
		status,
		winning_outcome_id: outcomeId
	};
}
