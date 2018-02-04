import Subscription, { SubscriptionData } from '../Subscription';
import Channel, { ChannelData } from '../Channel/Channel';

/** @private */
export interface UserSubscriptionData extends SubscriptionData {
	channel: ChannelData;
}

export default class UserSubscription extends Subscription {
	/** @private */
	protected _data: UserSubscriptionData;

	get channel() {
		return new Channel(this._data.channel, this._client);
	}
}
