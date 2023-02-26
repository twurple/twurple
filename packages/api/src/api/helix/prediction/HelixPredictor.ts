import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../../client/BaseApiClient';
import { type HelixPredictorData } from '../../../interfaces/helix/prediction.external';
import type { HelixUser } from '../user/HelixUser';

/**
 * A user that took part in a prediction.
 */
@rtfm<HelixPredictor>('api', 'HelixPredictor', 'userId')
export class HelixPredictor extends DataObject<HelixPredictorData> {
	@Enumerable(false) private readonly _client: BaseApiClient;

	/** @private */
	constructor(data: HelixPredictorData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The user ID of the predictor.
	 */
	get userId(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The name of the predictor.
	 */
	get userName(): string {
		return this[rawDataSymbol].login;
	}

	/**
	 * The display name of the predictor.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].name;
	}

	/**
	 * Gets more information about the predictor.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].id);
	}

	/**
	 * The amount of channel points the predictor used for the prediction.
	 */
	get channelPointsUsed(): number {
		return this[rawDataSymbol].channel_points_used;
	}

	/**
	 * The amount of channel points the predictor won for the prediction, or null if the prediction is not resolved yet, was cancelled or lost.
	 */
	get channelPointsWon(): number | null {
		return this[rawDataSymbol].channel_points_won;
	}
}
