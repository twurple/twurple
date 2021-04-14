import { rtfm } from '@twurple/common';
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
@rtfm<ChannelSubscription>('twitch', 'ChannelSubscription', 'userId')
export class ChannelSubscription extends Subscription {
	/** @private */ protected declare readonly _data: ChannelSubscriptionData;

	/**
	 * The user subscribing to the given channel.
	 */
	get user(): User {
		return new User(this._data.user, this._client);
	}

	/**
	 * The ID of the user subscribing to the given channel.
	 */
	get userId(): string {
		return this._data.user._id;
	}
}
