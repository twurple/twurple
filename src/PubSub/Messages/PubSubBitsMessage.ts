import { PubSubBasicMessageInfo } from './PubSubMessage';
import { NonEnumerable } from '../../Toolkit/Decorators';
import HelixUser from '../../API/Helix/User/HelixUser';
import TwitchClient from '../../TwitchClient';

export interface PubSubBitsMessageBitsEntitlement {
	previous_version: number;
	new_version: number;
}

export interface PubSubBitsMessageContent extends PubSubBasicMessageInfo {
	chat_message: string;
	bits_used: number;
	total_bits_used: number;
	context: 'cheer'; // TODO is this complete?
	badge_entitlement: PubSubBitsMessageBitsEntitlement | null;
}

export interface PubSubBitsMessageData {
	data: PubSubBitsMessageContent;
	version: string;
	message_type: string;
	message_id: string;
}

export default class PubSubBitsMessage {
	@NonEnumerable private readonly _twitchClient: TwitchClient;

	constructor(private readonly _data: PubSubBitsMessageData, twitchClient: TwitchClient) {
		this._twitchClient = twitchClient;
	}

	get userId() {
		return this._data.data.user_id;
	}

	get userName() {
		return this._data.data.user_name;
	}

	async getUser(): Promise<HelixUser> {
		return this._twitchClient.helix.users.getUserById(this._data.data.user_id);
	}

	get message() {
		return this._data.data.chat_message;
	}

	get bits() {
		return this._data.data.bits_used;
	}

	get totalBits() {
		return this._data.data.total_bits_used;
	}
}
