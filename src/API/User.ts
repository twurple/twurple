import Twitch from '../';
import { NonEnumerable } from '../Toolkit/Decorators';
import Channel from './Channel';
import ChannelPlaceholder from './ChannelPlaceholder';

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
}
