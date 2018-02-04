import { NonEnumerable } from '../Toolkit/Decorators';
import TwitchClient from '../TwitchClient';

export default class BaseAPI {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(client: TwitchClient) {
		this._client = client;
	}
}
