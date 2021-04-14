import { rtfm } from '@twurple/common';
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
@rtfm<UserSubscription>('api', 'UserSubscription', 'channelId')
export class UserSubscription extends Subscription {
	/** @private */ protected declare readonly _data: UserSubscriptionData;

	/**
	 * The subscribed channel.
	 */
	get channel(): Channel {
		return new Channel(this._data.channel, this._client);
	}

	/**
	 * The ID of the subscribed channel.
	 */
	get channelId(): string {
		return this._data.channel._id;
	}
}
