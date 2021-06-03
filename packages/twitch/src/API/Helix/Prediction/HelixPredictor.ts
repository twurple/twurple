import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';
import { rtfm } from 'twitch-common';

/** @private */
export interface HelixPredictorData {
	id: string;
	name: string;
	login: string;
	channel_points_used: number;
	channel_points_won: number | null;
}

/**
 * A user that took part in a prediction.
 */
@rtfm<HelixPredictor>('twitch', 'HelixPredictor', 'userId')
export class HelixPredictor {
	@Enumerable(false) private readonly _data: HelixPredictorData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixPredictorData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The user ID of the predictor.
	 */
	get userId(): string {
		return this._data.id;
	}

	/**
	 * The name of the predictor.
	 */
	get userName(): string {
		return this._data.login;
	}

	/**
	 * The display name of the predictor.
	 */
	get userDisplayName(): string {
		return this._data.name;
	}

	/**
	 * Retrieves more information about the predictor.
	 */
	async getUser(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.id);
	}

	/**
	 * The amount of channel points the predictor used for the prediction.
	 */
	get channelPointsUsed(): number {
		return this._data.channel_points_used;
	}

	/**
	 * The amount of channel points the predictor won for the prediction, or null if the prediction is not resolved yet, was cancelled or lost.
	 */
	get channelPointsWon(): number | null {
		return this._data.channel_points_won;
	}
}
