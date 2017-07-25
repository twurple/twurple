import ChannelPlaceholder, { ChannelPlaceholderData } from './ChannelPlaceholder';
import Twitch from '../../';
import { UserIdResolvable } from '../../Toolkit/UserTools';
import ChannelSubscription from './ChannelSubscription';
import NoSubscriptionProgram from '../NoSubscriptionProgram';
import NotSubscribed from '../NotSubscribed';
import { ChannelUpdateData } from './ChannelAPI';
import ChannelFollow from './ChannelFollow';

export interface ChannelData extends ChannelPlaceholderData {
	_id: string;
	broadcaster_language: string;
	broadcaster_type: string;
	created_at: string;
	description: string;
	display_name: string;
	followers: number;
	game: string;
	language: string;
	logo: string;
	mature: boolean;
	name: string;
	partner: boolean;
	profile_banner: string | null;
	profile_bannel_background_color: string | null;
	status: string;
	updated_at: string;
	url: string;
	video_banner: string;
	views: number;
}

export default class Channel extends ChannelPlaceholder {
	protected _data: ChannelData;

	constructor(data: ChannelData, client: Twitch) {
		super(data._id, client);
		this._data = data;
	}

	// override parent's method so we avoid the API/cache request here if someone wrongly assumes this is a placeholder
	async getChannel() {
		return this;
	}

	async update(data: ChannelUpdateData) {
		return this._client.channels.updateChannel(this, data);
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
