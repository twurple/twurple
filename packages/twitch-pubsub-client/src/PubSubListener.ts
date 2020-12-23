import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { PubSubMessage } from './Messages/PubSubMessage';
import type { SingleUserPubSubClient } from './SingleUserPubSubClient';

/**
 * A listener attached to a single PubSub topic.
 */
@rtfm<PubSubListener>('twitch-pubsub-client', 'PubSubListener', 'userId')
export class PubSubListener<T extends PubSubMessage = PubSubMessage> {
	@Enumerable(false) private readonly _client: SingleUserPubSubClient;

	/** @private */
	constructor(
		private readonly _topic: string,
		private readonly _userId: string,
		private readonly _callback: (message: T) => void,
		client: SingleUserPubSubClient
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
	async remove(): Promise<void> {
		return this._client.removeListener(this);
	}

	/** @private */
	call(message: T): void {
		this._callback(message);
	}
}
