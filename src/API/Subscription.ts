import { NonEnumerable } from '../Toolkit/Decorators';
import Twitch from '../';

export interface SubscriptionData {
	_id: string;
	sub_plan: string;
	sub_plan_name: string;
	created_at: string;
}

export default class Subscription {
	@NonEnumerable protected _client: Twitch;

	constructor(protected _data: SubscriptionData, client: Twitch) {
		this._client = client;
	}

	get subPlan() {
		return this._data.sub_plan;
	}

	get subPlanName() {
		return this._data.sub_plan_name;
	}
}
