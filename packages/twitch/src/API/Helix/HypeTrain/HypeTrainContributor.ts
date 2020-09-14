import { Enumerable } from '@d-fischer/shared-utils';
import { ApiClient } from '../../../ApiClient';
import { UserIdResolvable } from '../../../Toolkit/UserTools';

/**
 * The type of a hypetrain contribution.
 */
export enum HypeTrainContributionType {
	/**
	 * A Twitch Partner.
	 */
	Bits = 'BITS',

	/**
	 * A Twitch Affiliate.
	 */
	Subscription = 'SUBS'
}

/** @private */
export interface HypeTrainContributorData {
	id: UserIdResolvable;
	type: HypeTrainContributionType;
	total: string;
}

/**
 * A HypeTrain contributor.
 */
export class HypeTrainContributor {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(/** @private */ protected _data: HypeTrainContributorData) {
		this._data = _data;
	}

	/**
	 * The ID of the user.
	 */
	get id() {
		return this._data.id;
	}

	/**
	 * The hypetrain event type.
	 */
	get type() {
		return this._data.type;
	}

	/**
	 * The total contribution amount in subs or bits.
	 */
	get total() {
		return this._data.total;
	}
}
