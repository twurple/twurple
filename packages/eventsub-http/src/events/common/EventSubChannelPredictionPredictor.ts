import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export interface EventSubChannelPredictionPredictorData {
	user_name: string;
	user_login: string;
	user_id: string;
	channel_points_won: number | null;
	channel_points_used: number;
}

/**
 * A user that voted on a prediction.
 */
@rtfm<EventSubChannelPredictionPredictor>('eventsub', 'EventSubChannelPredictionPredictor', 'userId')
export class EventSubChannelPredictionPredictor extends DataObject<EventSubChannelPredictionPredictorData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelPredictionPredictorData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the predictor.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the predictor.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the predictor.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Retrieves more information about the predictor.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
	}

	/**
	 * The number of channel points the predictor used.
	 */
	get channelPointsUsed(): number {
		return this[rawDataSymbol].channel_points_used;
	}

	/**
	 * The number of channel points the predictor won, or null if they didn't win (yet).
	 */
	get channelPointsWon(): number | null {
		return this[rawDataSymbol].channel_points_won;
	}
}
