import { rawDataSymbol, rtfm } from '@twurple/common';
import type { ChannelData } from '../channel/Channel';
import { Channel } from '../channel/Channel';
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
	/** @private */ declare readonly [rawDataSymbol]: UserSubscriptionData;

	/**
	 * The subscribed channel.
	 */
	get channel(): Channel {
		return new Channel(this[rawDataSymbol].channel, this._client);
	}

	/**
	 * The ID of the subscribed channel.
	 */
	get channelId(): string {
		return this[rawDataSymbol].channel._id;
	}
}
