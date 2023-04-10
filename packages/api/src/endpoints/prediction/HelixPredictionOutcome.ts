import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient';
import {
	type HelixPredictionOutcomeColor,
	type HelixPredictionOutcomeData
} from '../../interfaces/endpoints/prediction.external';
import { HelixPredictor } from './HelixPredictor';

/**
 * A possible outcome in a channel prediction.
 */
@rtfm<HelixPredictionOutcome>('api', 'HelixPredictionOutcome', 'id')
export class HelixPredictionOutcome extends DataObject<HelixPredictionOutcomeData> {
	@Enumerable(false) private readonly _client: BaseApiClient;

	/** @private */
	constructor(data: HelixPredictionOutcomeData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the outcome.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The title of the outcome.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The number of users that guessed the outcome.
	 */
	get users(): number {
		return this[rawDataSymbol].users;
	}

	/**
	 * The total number of channel points that were spent on guessing the outcome.
	 */
	get totalChannelPoints(): number {
		return this[rawDataSymbol].channel_points;
	}

	/**
	 * The color of the outcome.
	 */
	get color(): HelixPredictionOutcomeColor {
		return this[rawDataSymbol].color;
	}

	/**
	 * The top predictors of the outcome.
	 */
	get topPredictors(): HelixPredictor[] {
		return this[rawDataSymbol].top_predictors?.map(data => new HelixPredictor(data, this._client)) ?? [];
	}
}
