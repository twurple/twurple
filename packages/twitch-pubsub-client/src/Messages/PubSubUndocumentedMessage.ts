import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';

/** @private */
export interface PubSubUndocumentedMessageContent {
	data: unknown;
}

/** @private */
export interface PubSubUndocumentedMessageData {
	data: PubSubUndocumentedMessageContent;
	type: string;
}

/**
 * A message that informs about a user unlocking a new bits badge.
 */
@rtfm<PubSubUndocumentedMessage>('twitch-pubsub-client', 'PubSubUndocumentedMessage', 'data')
export class PubSubUndocumentedMessage {
	@Enumerable(false) private readonly _data: PubSubUndocumentedMessageData;

	/** @private */
	constructor(data: PubSubUndocumentedMessageData) {
		this._data = data;
	}

	/**
	 * The message data.
	 */
	get data(): unknown {
		return this._data.data;
	}
}
