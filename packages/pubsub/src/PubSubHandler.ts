import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { PubSubMessage } from './messages/PubSubMessage';
import { type PubSubClient } from './PubSubClient';

/**
 * A handler attached to a single PubSub topic.
 */
@rtfm<PubSubHandler>('pubsub', 'PubSubHandler', 'userId')
export class PubSubHandler<T extends PubSubMessage = PubSubMessage> {
	@Enumerable(false) private readonly _client: PubSubClient;

	/** @private */
	constructor(
		private readonly _topic: string,
		private readonly _userId: string,
		private readonly _callback: (message: T) => void,
		client: PubSubClient
	) {
		this._client = client;
	}

	/**
	 * The type of the topic.
	 */
	get topic(): string {
		return this._topic;
	}

	/**
	 * The user ID part of the topic.
	 */
	get userId(): string {
		return this._userId;
	}

	/**
	 * Removes the topic from the PubSub client.
	 */
	remove(): void {
		this._client.removeHandler(this);
	}

	/** @private */
	call(message: T): void {
		this._callback(message);
	}
}
