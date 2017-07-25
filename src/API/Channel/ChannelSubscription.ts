import Subscription, { SubscriptionData } from '../Subscription';
import User, { UserData } from '../User/';

export interface ChannelSubscriptionData extends SubscriptionData {
	user: UserData;
}

export default class ChannelSubscription extends Subscription {
	protected _data: ChannelSubscriptionData;

	get user() {
		return new User(this._data.user, this._client);
	}
}
