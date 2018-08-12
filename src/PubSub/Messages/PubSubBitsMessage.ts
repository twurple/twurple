import { PubSubBasicMessageInfo } from './PubSubMessage';
import { NonEnumerable } from '../../Toolkit/Decorators';
import HelixUser from '../../API/Helix/User/HelixUser';
import TwitchClient from '../../TwitchClient';

/** @private */
export interface PubSubBitsMessageBitsEntitlement {
	previous_version: number;
	new_version: number;
}

/** @private */
export interface PubSubBitsMessageContent extends PubSubBasicMessageInfo {
	chat_message: string;
	bits_used: number;
	total_bits_used: number;
	context: 'cheer'; // TODO is this complete?
	badge_entitlement: PubSubBitsMessageBitsEntitlement | null;
}

/** @private */
export interface PubSubBitsMessageData {
	data: PubSubBitsMessageContent;
	version: string;
	message_type: string;
	message_id: string;
}

/**
 * A message that informs about bits being used in a channel.
 */
export default class PubSubBitsMessage {
	@NonEnumerable private readonly _twitchClient: TwitchClient;

	/** @private */
	constructor(private readonly _data: PubSubBitsMessageData, twitchClient: TwitchClient) {
		this._twitchClient = twitchClient;
	}

	/**
	 * The ID of the user that sent the bits.
	 */
	get userId() {
		return this._data.data.user_id;
	}

	/**
	 * The name of the user that sent the bits.
	 */
	get userName() {
		return this._data.data.user_name;
	}

	/**
	 * Retrieves more data about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return this._twitchClient.helix.users.getUserById(this._data.data.user_id);
	}

	/**
	 * The full message that was sent with the bits.
	 */
	get message() {
		return this._data.data.chat_message;
	}

	/**
	 * The number of bits that were sent.
	 */
	get bits() {
		return this._data.data.bits_used;
	}

	/**
	 * The total number of bits that were ever sent by the user in the channel.
	 */
	get totalBits() {
		return this._data.data.total_bits_used;
	}
}
