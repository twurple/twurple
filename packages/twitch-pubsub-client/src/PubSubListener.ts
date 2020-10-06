import type { PubSubMessage } from './Messages/PubSubMessage';
import type { SingleUserPubSubClient } from './SingleUserPubSubClient';

/**
 * A listener attached to a single PubSub topic.
 */
export class PubSubListener<T extends PubSubMessage = PubSubMessage> {
	/** @private */
	constructor(
		private readonly _type: string,
		private readonly _userId: string,
		private readonly _callback: (message: T) => void,
		private readonly _client: SingleUserPubSubClient
	) {}

	/**
	 * The type of the topic.
	 */
	get type(): string {
		return this._type;
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
