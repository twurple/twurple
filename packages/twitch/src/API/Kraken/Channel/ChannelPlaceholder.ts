import { NonEnumerable } from '@d-fischer/shared-utils';
import NoSubscriptionProgramError from '../../../Errors/NoSubscriptionProgramError';
import { UserIdResolvable } from '../../../Toolkit/UserTools';
import TwitchClient from '../../../TwitchClient';

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
	async getCheermotes() {
		return this._client.kraken.bits.getCheermotes(this);
	}

	/**
	 * Retrieves the channel data.
	 */
	async getChannel() {
		return this._client.kraken.channels.getChannel(this);
	}

	/**
	 * Retrieves the channel's stream data.
	 */
	async getStream() {
		return this._client.kraken.streams.getStreamByChannel(this);
	}

	/**
	 * Retrieves the channel's followers.
	 */
	async getFollowers() {
		return this._client.kraken.channels.getChannelFollowers(this);
	}

	/**
	 * Retrieves the channel's subscribers.
	 */
	async getSubscriptions() {
		return this._client.kraken.channels.getChannelSubscriptions(this);
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
	async getSubscriptionBy(user: UserIdResolvable) {
		return this._client.kraken.channels.getChannelSubscriptionByUser(this, user);
	}

	/**
	 * Checks whether the given user is subscribed to the channel.
	 *
	 * @param user The user you want to check the subscription for.
	 */
	async hasSubscriber(user: UserIdResolvable) {
		try {
			return (await this.getSubscriptionBy(user)) !== null;
		} catch (e) {
			if (e instanceof NoSubscriptionProgramError) {
				return false;
			}

			throw e;
		}
	}
}
