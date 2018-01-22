import Channel, { ChannelData } from './Channel';
import User from '../User/User';
import { CommercialLength } from './ChannelAPI';

export interface PrivilegedChannelData extends ChannelData {
	stream_key: string;
	email: string;
}

export default class PrivilegedChannel extends Channel {
	protected _data: PrivilegedChannelData;

	get streamKey() {
		return this._data.stream_key;
	}

	async getEditors(): Promise<User[]> {
		return this._client.channels.getChannelEditors(this);
	}

	async startCommercial(length: CommercialLength) {
		return this._client.channels.startChannelCommercial(this, length);
	}

	async resetStreamKey() {
		return this._client.channels.resetChannelStreamKey(this);
	}
}
