import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '@twurple/api';
import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelPredictionBeginOutcome } from './EventSubChannelPredictionBeginOutcome';
import { type EventSubChannelPredictionOutcomeData } from './EventSubChannelPredictionOutcome.external';
import { EventSubChannelPredictionPredictor } from './EventSubChannelPredictionPredictor';

/**
 * A possible outcome of a prediction.
 */
@rtfm<EventSubChannelPredictionOutcome>('eventsub-base', 'EventSubChannelPredictionOutcome', 'id')
export class EventSubChannelPredictionOutcome extends EventSubChannelPredictionBeginOutcome {
	/** @private */ declare readonly [rawDataSymbol]: EventSubChannelPredictionOutcomeData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelPredictionOutcomeData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The number of users that predicted the outcome.
	 */
	get users(): number {
		return this[rawDataSymbol].users;
	}

	/**
	 * The number of channel points that were bet on the outcome.
	 */
	get channelPoints(): number {
		return this[rawDataSymbol].channel_points;
	}

	/**
	 * The top predictors of the choice.
	 */
	get topPredictors(): EventSubChannelPredictionPredictor[] {
		return this[rawDataSymbol].top_predictors.map(
			data => new EventSubChannelPredictionPredictor(data, this._client)
		);
	}
}
