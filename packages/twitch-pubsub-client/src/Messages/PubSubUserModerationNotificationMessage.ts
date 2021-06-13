import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';

export type PubSubUserModerationNotificationMessageStatus = 'PENDING' | 'ALLOWED' | 'DENIED' | 'EXPIRED';

/** @private */
export interface PubSubUserModerationNotificationMessageContent {
	message_id: string;
	status: PubSubUserModerationNotificationMessageStatus;
}

/** @private */
export interface PubSubUserModerationNotificationMessageData {
	type: 'automod_caught_message';
	data: PubSubUserModerationNotificationMessageContent;
}

/**
 * A message that informs about a moderation action on your message..
 */
@rtfm<PubSubUserModerationNotificationMessage>(
	'twitch-pubsub-client',
	'PubSubUserModerationNotificationMessage',
	'messageId'
)
export class PubSubUserModerationNotificationMessage {
	@Enumerable(false) private readonly _data: PubSubUserModerationNotificationMessageData;

	/** @private */
	constructor(data: PubSubUserModerationNotificationMessageData, private readonly _channelId: string) {
		this._data = data;
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
		return this._data.data.message_id;
	}

	/**
	 * The status of the queue entry.
	 */
	get status(): PubSubUserModerationNotificationMessageStatus {
		return this._data.data.status;
	}
}
