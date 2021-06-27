import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '../../../ApiClient';
import type { HelixPredictorData } from './HelixPredictor';
import { HelixPredictor } from './HelixPredictor';
import { rtfm } from 'twitch-common';

export type HelixPredictionOutcomeColor = 'BLUE' | 'PINK';

/** @private */
export interface HelixPredictionOutcomeData {
	id: string;
	title: string;
	users: number;
	channel_points: number;
	top_predictors: HelixPredictorData[] | null;
	color: HelixPredictionOutcomeColor;
}

/**
 * A possible outcome in a channel prediction.
 */
@rtfm<HelixPredictionOutcome>('twitch', 'HelixPredictionOutcome', 'id')
export class HelixPredictionOutcome {
	@Enumerable(false) private readonly _data: HelixPredictionOutcomeData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixPredictionOutcomeData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the outcome.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The title of the outcome.
	 */
	get title(): string {
		return this._data.title;
	}

	/**
	 * The number of users that guessed the outcome.
	 */
	get users(): number {
		return this._data.users;
	}

	/**
	 * The total number of channel points that were spent on guessing the outcome.
	 */
	get totalChannelPoints(): number {
		return this._data.channel_points;
	}

	/**
	 * The color of the outcome.
	 */
	get color(): HelixPredictionOutcomeColor {
		return this._data.color;
	}

	/**
	 * The top predictors of the outcome.
	 */
	get topPredictors(): HelixPredictor[] {
		return this._data.top_predictors?.map(data => new HelixPredictor(data, this._client)) ?? [];
	}
}
