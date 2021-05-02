import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';

/**
 * The type of a Hype Train contribution.
 */
export type HelixHypeTrainContributionType = 'BITS' | 'SUBS';

/** @private */
export interface HelixHypeTrainContributionData {
	total: number;
	user: string;
	type: HelixHypeTrainContributionType;
}

/**
 * A Hype Train contributor.
 */
@rtfm<HelixHypeTrainContribution>('api', 'HelixHypeTrainContribution', 'userId')
export class HelixHypeTrainContribution {
	@Enumerable(false) private readonly _data: HelixHypeTrainContributionData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixHypeTrainContributionData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the user contributing to the Hype Train.
	 */
	get userId(): string {
		return this._data.user;
	}

	/**
	 * Retrieves additional information about the user contributing to the Hype Train.
	 */
	async getUser(): Promise<HelixUser | null> {
		return await this._client.helix.users.getUserById(this._data.user);
	}

	/**
	 * The Hype Train event type.
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
