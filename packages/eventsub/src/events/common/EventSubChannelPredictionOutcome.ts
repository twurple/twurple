import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelPredictionBeginOutcomeData } from './EventSubChannelPredictionBeginOutcome';
import { EventSubChannelPredictionBeginOutcome } from './EventSubChannelPredictionBeginOutcome';
import type { EventSubChannelPredictionPredictorData } from './EventSubChannelPredictionPredictor';
import { EventSubChannelPredictionPredictor } from './EventSubChannelPredictionPredictor';

/** @private */
export interface EventSubChannelPredictionOutcomeData extends EventSubChannelPredictionBeginOutcomeData {
	users: number;
	channel_points: number;
	top_predictors: EventSubChannelPredictionPredictorData[];
}

/**
 * A possible outcome of a prediction.
 */
@rtfm<EventSubChannelPredictionOutcome>('eventsub', 'EventSubChannelPredictionOutcome', 'id')
export class EventSubChannelPredictionOutcome extends EventSubChannelPredictionBeginOutcome {
	/** @private */ protected declare readonly _data: EventSubChannelPredictionOutcomeData;
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
		return this._data.users;
	}

	/**
	 * The number of channel points that were bet on the outcome.
	 */
	get channelPoints(): number {
		return this._data.channel_points;
	}

	/**
	 * The top predictors of the choice.
	 */
	get topPredictors(): EventSubChannelPredictionPredictor[] {
		return this._data.top_predictors.map(data => new EventSubChannelPredictionPredictor(data, this._client));
	}
}
