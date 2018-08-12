import SingleUserPubSubClient from './SingleUserPubSubClient';
import PubSubMessage from './Messages/PubSubMessage';

/**
 * A listener attached to a single PubSub topic.
 */
export class PubSubListener<T extends PubSubMessage = PubSubMessage> {
	/** @private */
	constructor(private readonly _type: string, private readonly _userId: string, private readonly _callback: (message: T) => void, private readonly _client: SingleUserPubSubClient) {
	}

	/**
	 * The type of the topic.
	 */
	get type() {
		return this._type;
	}

	/**
	 * The user ID part of the topic.
	 */
	get userId() {
		return this._userId;
	}

	/**
	 * Removes the topic from the PubSub client.
	 */
	remove() {
		this._client.removeListener(this);
	}

	/** @private */
	call(message: T) {
		this._callback(message);
	}
}
