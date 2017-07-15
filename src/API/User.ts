import Twitch from '../';
import { NonEnumerable } from '../Toolkit/Decorators';
import Channel from './Channel';
import ChannelPlaceholder from './ChannelPlaceholder';
import { UserIdResolvable } from '../Toolkit/UserTools';
import UserSubscription from './UserSubscription';
import NoSubscriptionProgram from './NoSubscriptionProgram';
import NotSubscribed from './NotSubscribed';

export interface UserData {
	_id: string;
	bio: string;
	created_at: string;
	name: string;
	display_name: string;
	logo: string;
	type: string;
	updated_at: string;
}

export default class User {
	@NonEnumerable protected _client: Twitch;

	constructor(protected _data: UserData, client: Twitch) {
		this._client = client;
	}

	get cacheKey() {
		return this._data._id;
	}

	get id() {
		return this._data._id;
	}

	get userName() {
		return this._data.name;
	}

	get displayName() {
		return this._data.display_name;
	}

	async getChannel(): Promise<Channel> {
		return await this._client.channels.getChannelByUser(this);
	}

	getChannelPlaceholder() {
		return new ChannelPlaceholder(this._data._id, this._client);
	}

	async getSubscriptionTo(channel: UserIdResolvable): Promise<UserSubscription> {
		return await this._client.users.getSubscriptionData(this, channel);
	}

	async isSubscribedTo(channel: UserIdResolvable): Promise<boolean> {
		try {
			await this.getSubscriptionTo(channel);
			return true;
		} catch (e) {
			if (e instanceof NoSubscriptionProgram || e instanceof NotSubscribed) {
				return false;
			}

			throw e;
		}
	}
}
