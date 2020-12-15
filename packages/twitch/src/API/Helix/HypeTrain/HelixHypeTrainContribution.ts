import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';

/**
 * The type of a hype train contribution.
 */
export type HelixHypeTrainContributionType = 'BITS' | 'SUBS';

/** @private */
export interface HelixHypeTrainContributionData {
	total: number;
	user: string;
	type: HelixHypeTrainContributionType;
}

/**
 * A hype train contributor.
 */
@rtfm<HelixHypeTrainContribution>('twitch', 'HelixHypeTrainContribution', 'userId')
export class HelixHypeTrainContribution {
	@Enumerable(false) private readonly _data: HelixHypeTrainContributionData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixHypeTrainContributionData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the user contributing to the hype train.
	 */
	get userId(): string {
		return this._data.user;
	}

	/**
	 * Retrieves additional information about the user contributing to the hype train.
	 */
	async getUser(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.user);
	}

	/**
	 * The hype train event type.
	 */
	get type(): HelixHypeTrainContributionType {
		return this._data.type;
	}

	/**
	 * The total contribution amount in subs or bits.
	 */
	get total(): number {
		return this._data.total;
	}
}
