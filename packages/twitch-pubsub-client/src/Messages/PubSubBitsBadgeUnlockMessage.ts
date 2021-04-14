import type { MakeOptional } from '@d-fischer/shared-utils';
import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { PubSubBasicMessageInfo } from './PubSubMessage';

/** @private */
export interface PubSubBitsBadgeUnlockMessageContent
	extends MakeOptional<PubSubBasicMessageInfo, 'channel_id' | 'channel_name' | 'user_id' | 'user_name'> {
	chat_message: string;
	badge_tier: number;
}

/** @private */
export interface PubSubBitsBadgeUnlockMessageData {
	data: PubSubBitsBadgeUnlockMessageContent;
	version: string;
	message_type: string;
	message_id: string;
}

/**
 * A message that informs about a user unlocking a new bits badge.
 */
@rtfm<PubSubBitsBadgeUnlockMessage>('twitch-pubsub-client', 'PubSubBitsBadgeUnlockMessage', 'userId')
export class PubSubBitsBadgeUnlockMessage {
	@Enumerable(false) private readonly _data: PubSubBitsBadgeUnlockMessageData;

	/** @private */
	constructor(data: PubSubBitsBadgeUnlockMessageData) {
		this._data = data;
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
