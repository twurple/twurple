import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';

/**
 * A message in response to a subscription to a custom topic.
 */
@rtfm('twitch-pubsub-client', 'PubSubCustomMessage')
export class PubSubCustomMessage {
	@Enumerable(false) private readonly _data: unknown;

	/** @private */
	constructor(data: unknown) {
		this._data = data;
	}

	/**
	 * The message data.
	 */
	get data(): unknown {
		return this._data;
	}
}
