import SingleUserPubSubClient from './SingleUserPubSubClient';
import PubSubMessage from './Messages/PubSubMessage';

export class PubSubListener<T extends PubSubMessage = PubSubMessage> {
	constructor(private readonly _type: string, private readonly _userId: string, private readonly _callback: (message: T) => void, private readonly _client: SingleUserPubSubClient) {
	}

	get type() {
		return this._type;
	}

	get userId() {
		return this._userId;
	}

	remove() {
		this._client.removeListener(this);
	}

	call(message: T) {
		this._callback(message);
	}
}
