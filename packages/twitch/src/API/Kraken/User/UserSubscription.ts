import { Channel, ChannelData } from '../Channel/Channel';
import { Subscription, SubscriptionData } from '../Subscription';

/** @private */
export interface UserSubscriptionData extends SubscriptionData {
	channel: ChannelData;
}

/**
 * A relation of a previously given user subscribing to a channel.
 */
export class UserSubscription extends Subscription {
	/** @private */
	protected _data: UserSubscriptionData;

	/**
	 * The subscribed channel.
	 */
	get channel() {
		return new Channel(this._data.channel, this._client);
	}
}
