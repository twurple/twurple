import Subscription, { SubscriptionData } from '../Subscription';
import Channel, { ChannelData } from '../Channel/Channel';

/** @private */
export interface UserSubscriptionData extends SubscriptionData {
	channel: ChannelData;
}

/**
 * A relation of a previously given user subscribing to a channel.
 */
export default class UserSubscription extends Subscription {
	/** @private */
	protected _data: UserSubscriptionData;

	/**
	 * The subscribed channel.
	 */
	get channel() {
		return new Channel(this._data.channel, this._client);
	}
}
