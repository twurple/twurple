import Twitch from '../../';
import { NonEnumerable } from '../../Toolkit/Decorators';
import CheermoteList from '../Bits/CheermoteList';
import Channel from './';
import Stream from '../Stream/';
import { UserIdResolvable } from '../../Toolkit/UserTools';
import ChannelSubscription from './ChannelSubscription';
import NoSubscriptionProgram from '../NoSubscriptionProgram';
import NotSubscribed from '../NotSubscribed';
import ChannelFollow from './ChannelFollow';

export interface ChannelPlaceholderData {
	_id: string;
}

export default class ChannelPlaceholder {
	@NonEnumerable protected _client: Twitch;
	protected _data: ChannelPlaceholderData;

	constructor(id: string, client: Twitch) {
		this._data = { _id: id };
		this._client = client;
	}

	get cacheKey() {
		return this._data._id;
	}

	get id() {
		return this._data._id;
	}

	async getCheermotes(): Promise<CheermoteList> {
		return this._client.bits.getCheermotes(this);
	}

	async getChannel(): Promise<Channel> {
		return this._client.channels.getChannel(this);
	}

	async getStream(): Promise<Stream> {
		return this._client.streams.getStreamByChannel(this);
	}

	async getFollowers(): Promise<ChannelFollow[]> {
		return this._client.channels.getChannelFollowers(this);
	}

	async getSubscriptions(): Promise<ChannelSubscription[]> {
		return this._client.channels.getChannelSubscriptions(this);
	}

	async getSubscriptionBy(user: UserIdResolvable): Promise<ChannelSubscription> {
		return this._client.channels.getChannelSubscriptionByUser(this, user);
	}

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
