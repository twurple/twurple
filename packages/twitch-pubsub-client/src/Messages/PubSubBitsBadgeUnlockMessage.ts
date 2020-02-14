import { MakeOptional, NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from 'twitch';
import { PubSubBasicMessageInfo } from './PubSubMessage';

export interface PubSubBitsBadgeUnlockMessageContent
	extends MakeOptional<PubSubBasicMessageInfo, 'channel_id' | 'channel_name' | 'user_id' | 'user_name'> {
	chat_message: string;
	badge_tier: number;
}

export interface PubSubBitsBadgeUnlockMessageData {
	data: PubSubBitsBadgeUnlockMessageContent;
	version: string;
	message_type: string;
	message_id: string;
}

/**
 * A message that informs about a user unlocking a new bits badge.
 */
export default class PubSubBitsBadgeUnlockMessage {
	@NonEnumerable private readonly _twitchClient: TwitchClient;

	/** @private */
	constructor(private readonly _data: PubSubBitsBadgeUnlockMessageData, twitchClient: TwitchClient) {
		this._twitchClient = twitchClient;
	}

	/**
	 * The ID of the user that unlocked the badge.
	 */
	get userId() {
		return this._data.data.user_id;
	}

	/**
	 * The name of the user that unlocked the badge.
	 */
	get userName() {
		return this._data.data.user_name;
	}

	/**
	 * Retrieves more data about the user.
	 */
	async getUser() {
		return this._data.data.user_id ? this._twitchClient.helix.users.getUserById(this._data.data.user_id) : null;
	}

	/**
	 * The full message that was sent with the notification.
	 */
	get message() {
		return this._data.data.chat_message;
	}

	/**
	 * The new badge tier.
	 */
	get badgeTier() {
		return this._data.data.badge_tier;
	}
}
