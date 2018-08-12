import { NonEnumerable } from '../../Toolkit/Decorators';
import CheermoteList from '../Bits/CheermoteList';
import Channel from './Channel';
import Stream from '../Stream/Stream';
import { UserIdResolvable } from '../../Toolkit/UserTools';
import ChannelSubscription from './ChannelSubscription';
import NoSubscriptionProgram from '../NoSubscriptionProgram';
import NotSubscribed from '../NotSubscribed';
import ChannelFollow from './ChannelFollow';
import TwitchClient from '../../TwitchClient';

/** @private */
export interface ChannelPlaceholderData {
	_id: string;
}

/**
 * A placeholder for a channel.
 *
 * This is used for example when you only have retrieved user data, but not channel data.
 * This can do anything you can do with only a channel ID, as it's equivalent to the user ID.
 */
export default class ChannelPlaceholder {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	protected _data: ChannelPlaceholderData;

	/** @private */
	constructor(id: string, client: TwitchClient) {
		this._data = { _id: id };
		this._client = client;
	}

	/** @private */
	get cacheKey() {
		return this._data._id;
	}

	/**
	 * The ID of the channel.
	 */
	get id() {
		return this._data._id;
	}

	/**
	 * Retrieves the list of cheermotes you can use in the channel.
	 */
	async getCheermotes(): Promise<CheermoteList> {
		return this._client.bits.getCheermotes(this);
	}

	/**
	 * Retrieves the channel data.
	 */
	async getChannel(): Promise<Channel> {
		return this._client.channels.getChannel(this);
	}

	/**
	 * Retrieves the channel's stream data.
	 */
	async getStream(): Promise<Stream> {
		return this._client.streams.getStreamByChannel(this);
	}

	/**
	 * Retrieves the channel's followers.
	 */
	async getFollowers(): Promise<ChannelFollow[]> {
		return this._client.channels.getChannelFollowers(this);
	}

	/**
	 * Retrieves the channel's subscribers.
	 */
	async getSubscriptions(): Promise<ChannelSubscription[]> {
		return this._client.channels.getChannelSubscriptions(this);
	}

	/**
	 * Retrieves the subscription data for the given user to the channel.
	 *
	 * Throws if the channel doesn't have a subscription program or the user is not subscribed to it.
	 *
	 * This method requires access to the channel. If you only have access to the user,
	 * use {@User#getSubscriptionTo} instead.
	 *
	 * @param user The user you want to get the subscription data for.
	 */
	async getSubscriptionBy(user: UserIdResolvable): Promise<ChannelSubscription> {
		return this._client.channels.getChannelSubscriptionByUser(this, user);
	}

	/**
	 * Checks whether the given user is subscribed to the channel.
	 *
	 * @param user The user you want to check the subscription for.
	 */
	async hasSubscriber(user: UserIdResolvable): Promise<boolean> {
		try {
			await this.getSubscriptionBy(user);
			return true;
		} catch (e) {
			if (e instanceof NoSubscriptionProgram || e instanceof NotSubscribed) {
				return false;
			}

			throw e;
		}
	}
}
