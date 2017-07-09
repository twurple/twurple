import Twitch from '../';
import { NonEnumerable } from '../Toolkit/Decorators';
import CheermoteList from './CheermoteList';
import Channel from './Channel';

export interface ChannelPlaceholderData {
	_id: string;
}

export default class ChannelPlaceholder {
	@NonEnumerable protected _client: Twitch;
	protected _data: ChannelPlaceholderData;

	constructor(id: string, client: Twitch) {
		this._data = {_id: id};
		this._client = client;
	}

	get id() {
		return this._data._id;
	}

	async getCheermotes(): Promise<CheermoteList> {
		return await this._client.bits.getCheermotes(this);
	}

	async getChannel(): Promise<Channel> {
		return await this._client.channels.getChannelByUser(this);
	}
}
