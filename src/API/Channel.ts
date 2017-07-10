import ChannelPlaceholder, { ChannelPlaceholderData } from './ChannelPlaceholder';
import Twitch from '../index';
import { UserIdResolvable } from '../Toolkit/UserTools';
import ChannelSubscription from './ChannelSubscription';

export interface ChannelData extends ChannelPlaceholderData {
	_id: string;
	bio: string;
	created_at: string;
	display_name: string;
	logo: string;
	type: string;
	updated_at: string;
}

export default class Channel extends ChannelPlaceholder {
	constructor(_data: ChannelData, client: Twitch) {
		super(_data._id, client);
	}

	// override parent's method so we avoid the API/cache request here if someone wrongly assumes this is a placeholder
	async getChannel() {
		return this;
	}

	async getSubscriptionBy(user: UserIdResolvable): Promise<ChannelSubscription> {
		return await this._client.channels.getSubscriptionData(this, user);
	}
}
