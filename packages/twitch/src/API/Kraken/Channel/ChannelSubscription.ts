import type { SubscriptionData } from '../Subscription';
import { Subscription } from '../Subscription';
import type { UserData } from '../User/User';
import { User } from '../User/User';

/** @private */
export interface ChannelSubscriptionsResponse {
	_total: number;
	subscriptions: ChannelSubscriptionData[];
}

/** @private */
export interface ChannelSubscriptionData extends SubscriptionData {
	user: UserData;
}

/**
 * A relation of a user subscribing to a previously given channel.
 */
export class ChannelSubscription extends Subscription {
	/** @private */
	protected _data: ChannelSubscriptionData;

	/**
	 * The user subscribing to the given channel.
	 */
	get user(): User {
		return new User(this._data.user, this._client);
	}
}
