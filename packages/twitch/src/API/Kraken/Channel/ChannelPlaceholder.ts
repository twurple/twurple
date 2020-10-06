import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '../../../ApiClient';
import { NoSubscriptionProgramError } from '../../../Errors/NoSubscriptionProgramError';
import type { UserIdResolvable } from '../../../Toolkit/UserTools';
import type { CheermoteList } from '../Bits/CheermoteList';
import type { Stream } from '../Stream/Stream';
import type { Channel } from './Channel';
import type { ChannelFollow } from './ChannelFollow';
import type { ChannelSubscription } from './ChannelSubscription';

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
export class ChannelPlaceholder {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	protected _data: ChannelPlaceholderData;

	/** @private */
	constructor(id: string, client: ApiClient) {
		this._data = { _id: id };
		this._client = client;
	}

	/** @private */
	get cacheKey(): string {
		return this._data._id;
	}

	/**
	 * The ID of the channel.
	 */
	get id(): string {
		return this._data._id;
	}

	/**
	 * Retrieves the list of cheermotes you can use in the channel.
	 */
	async getCheermotes(): Promise<CheermoteList> {
		return this._client.kraken.bits.getCheermotes(this);
	}

	/**
	 * Retrieves the channel data.
	 */
	async getChannel(): Promise<Channel> {
		return this._client.kraken.channels.getChannel(this);
	}

	/**
	 * Retrieves the channel's stream data.
	 */
	async getStream(): Promise<Stream | null> {
		return this._client.kraken.streams.getStreamByChannel(this);
	}

	/**
	 * Retrieves the channel's followers.
	 */
	async getFollowers(): Promise<ChannelFollow[]> {
		return this._client.kraken.channels.getChannelFollowers(this);
	}

	/**
	 * Retrieves the channel's subscribers.
	 */
	async getSubscriptions(): Promise<ChannelSubscription[]> {
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
	async getSubscriptionBy(user: UserIdResolvable): Promise<ChannelSubscription | null> {
		return this._client.kraken.channels.getChannelSubscriptionByUser(this, user);
	}

	/**
	 * Checks whether the given user is subscribed to the channel.
	 *
	 * @param user The user you want to check the subscription for.
	 */
	async hasSubscriber(user: UserIdResolvable): Promise<boolean> {
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
