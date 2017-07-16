import Twitch from '../../';
import { NonEnumerable } from '../../Toolkit/Decorators';
import CheermoteList from '../Bits/CheermoteList';
import Channel from './';

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
		return this._client.channels.getChannelByUser(this);
	}
}
