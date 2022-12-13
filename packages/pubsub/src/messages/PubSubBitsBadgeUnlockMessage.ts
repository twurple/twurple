import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type PubSubBitsBadgeUnlockMessageData } from './PubSubBitsBadgeUnlockMessage.external';

/**
 * A message that informs about a user unlocking a new bits badge.
 */
@rtfm<PubSubBitsBadgeUnlockMessage>('pubsub', 'PubSubBitsBadgeUnlockMessage', 'userId')
export class PubSubBitsBadgeUnlockMessage extends DataObject<PubSubBitsBadgeUnlockMessageData> {
	/**
	 * The ID of the user that unlocked the badge.
	 */
	get userId(): string | undefined {
		return this[rawDataSymbol].data.user_id;
	}

	/**
	 * The name of the user that unlocked the badge.
	 */
	get userName(): string | undefined {
		return this[rawDataSymbol].data.user_name;
	}

	/**
	 * The full message that was sent with the notification.
	 */
	get message(): string {
		return this[rawDataSymbol].data.chat_message;
	}

	/**
	 * The new badge tier.
	 */
	get badgeTier(): number {
		return this[rawDataSymbol].data.badge_tier;
	}
}
