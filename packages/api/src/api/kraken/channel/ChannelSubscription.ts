import { rawDataSymbol, rtfm } from '@twurple/common';
import type { SubscriptionData } from '../Subscription';
import { Subscription } from '../Subscription';
import type { UserData } from '../user/User';
import { User } from '../user/User';

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
@rtfm<ChannelSubscription>('api', 'ChannelSubscription', 'userId')
export class ChannelSubscription extends Subscription {
	/** @private */ declare readonly [rawDataSymbol]: ChannelSubscriptionData;

	/**
	 * The user subscribing to the given channel.
	 */
	get user(): User {
		return new User(this[rawDataSymbol].user, this._client);
	}

	/**
	 * The ID of the user subscribing to the given channel.
	 */
	get userId(): string {
		return this[rawDataSymbol].user._id;
	}
}
