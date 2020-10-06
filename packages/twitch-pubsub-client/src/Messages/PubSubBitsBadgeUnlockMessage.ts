import type { MakeOptional } from '@d-fischer/shared-utils';
import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';
import type { PubSubBasicMessageInfo } from './PubSubMessage';

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
export class PubSubBitsBadgeUnlockMessage {
	@Enumerable(false) private readonly _apiClient: ApiClient;

	/** @private */
	constructor(private readonly _data: PubSubBitsBadgeUnlockMessageData, apiClient: ApiClient) {
		this._apiClient = apiClient;
	}

	/**
	 * The ID of the user that unlocked the badge.
	 */
	get userId(): string | undefined {
		return this._data.data.user_id;
	}

	/**
	 * The name of the user that unlocked the badge.
	 */
	get userName(): string | undefined {
		return this._data.data.user_name;
	}

	/**
	 * Retrieves more data about the user.
	 *
	 * @deprecated Use {@HelixUserApi#getUserById} instead.
	 */
	async getUser(): Promise<HelixUser | null> {
		return this._data.data.user_id ? this._apiClient.helix.users.getUserById(this._data.data.user_id) : null;
	}

	/**
	 * The full message that was sent with the notification.
	 */
	get message(): string {
		return this._data.data.chat_message;
	}

	/**
	 * The new badge tier.
	 */
	get badgeTier(): number {
		return this._data.data.badge_tier;
	}
}
