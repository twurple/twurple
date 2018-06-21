import Subscription, { SubscriptionData } from '../Subscription';
import User, { UserData } from '../User/User';

/** @private */
export interface ChannelSubscriptionData extends SubscriptionData {
	user: UserData;
}

/**
 * A relation of a user subscribing to a previously given channel.
 */
export default class ChannelSubscription extends Subscription {
	protected _data: ChannelSubscriptionData;

	/**
	 * The user subscribing to the given channel.
	 */
	get user() {
		return new User(this._data.user, this._client);
	}
}
