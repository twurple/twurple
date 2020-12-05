import type { ChannelData } from '../Channel/Channel';
import { Channel } from '../Channel/Channel';
import type { SubscriptionData } from '../Subscription';
import { Subscription } from '../Subscription';

/** @private */
export interface UserSubscriptionData extends SubscriptionData {
	channel: ChannelData;
}

/**
 * A relation of a previously given user subscribing to a channel.
 */
export class UserSubscription extends Subscription {
	/** @private */
	protected declare _data: UserSubscriptionData;

	/**
	 * The subscribed channel.
	 */
	get channel(): Channel {
		return new Channel(this._data.channel, this._client);
	}
}
