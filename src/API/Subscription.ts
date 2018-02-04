import { NonEnumerable } from '../Toolkit/Decorators';
import TwitchClient from '../TwitchClient';

/** @private */
export interface SubscriptionData {
	_id: string;
	sub_plan: string;
	sub_plan_name: string;
	created_at: string;
}

export default class Subscription {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(/** @private */ protected _data: SubscriptionData, client: TwitchClient) {
		this._client = client;
	}

	get subPlan() {
		return this._data.sub_plan;
	}

	get subPlanName() {
		return this._data.sub_plan_name;
	}
}
