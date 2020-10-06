import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';

/**
 * The type of a hype train contribution.
 */
export type HypeTrainContributionType = 'BITS' | 'SUBS';

/** @private */
export interface HypeTrainContributionData {
	total: number;
	user: string;
	type: HypeTrainContributionType;
}

/**
 * A hype train contributor.
 */
export class HypeTrainContribution {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private _data: HypeTrainContributionData, client: ApiClient) {
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
	get type(): HypeTrainContributionType {
		return this._data.type;
	}

	/**
	 * The total contribution amount in subs or bits.
	 */
	get total(): number {
		return this._data.total;
	}
}
