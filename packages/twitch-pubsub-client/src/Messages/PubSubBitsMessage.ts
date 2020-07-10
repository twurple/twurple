import { Enumerable, MakeOptional } from '@d-fischer/shared-utils';
import { ApiClient } from 'twitch';
import { PubSubBasicMessageInfo } from './PubSubMessage';

export interface PubSubBitsMessageBadgeEntitlement {
	previous_version: number;
	new_version: number;
}

export interface PubSubBitsMessageContent
	extends MakeOptional<PubSubBasicMessageInfo, 'channel_id' | 'channel_name' | 'user_id' | 'user_name'> {
	chat_message: string;
	bits_used: number;
	total_bits_used: number;
	context: 'cheer'; // TODO is this complete?
	badge_entitlement: PubSubBitsMessageBadgeEntitlement | null;
	is_anonymous: boolean;
}

export interface PubSubBitsMessageData {
	data: PubSubBitsMessageContent;
	version: string;
	message_type: string;
	message_id: string;
}

/**
 * A message that informs about bits being used in a channel.
 */
export class PubSubBitsMessage {
	@Enumerable(false) private readonly _apiClient: ApiClient;

	/** @private */
	constructor(private readonly _data: PubSubBitsMessageData, apiClient: ApiClient) {
		this._apiClient = apiClient;
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
	 *
	 * @deprecated Use {@HelixUserApi#getUserById} instead.
	 */
	async getUser() {
		return this._data.data.user_id ? this._apiClient.helix.users.getUserById(this._data.data.user_id) : null;
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

	/**
	 * Whether the cheer was anonymous.
	 */
	get isAnonymous() {
		return this._data.data.is_anonymous;
	}
}
