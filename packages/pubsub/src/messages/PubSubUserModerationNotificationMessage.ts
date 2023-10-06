import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type PubSubUserModerationNotificationMessageData,
	type PubSubUserModerationNotificationMessageStatus,
} from './PubSubUserModerationNotificationMessage.external';

/**
 * A message that informs about a moderation action on your message..
 */
@rtfm<PubSubUserModerationNotificationMessage>('pubsub', 'PubSubUserModerationNotificationMessage', 'messageId')
export class PubSubUserModerationNotificationMessage extends DataObject<PubSubUserModerationNotificationMessageData> {
	/** @internal */
	constructor(data: PubSubUserModerationNotificationMessageData, private readonly _channelId: string) {
		super(data);
	}

	/**
	 * The ID of the channel where the message was posted.
	 */
	get channelId(): string {
		return this._channelId;
	}

	/**
	 * The ID of the message.
	 */
	get messageId(): string {
		return this[rawDataSymbol].data.message_id;
	}

	/**
	 * The status of the queue entry.
	 */
	get status(): PubSubUserModerationNotificationMessageStatus {
		return this[rawDataSymbol].data.status;
	}
}
