import { NonEnumerable } from '../Toolkit/Decorators';
import TwitchClient from '../TwitchClient';

/** @private */
export default class BaseAPI {
	@NonEnumerable protected readonly _client: TwitchClient;

	constructor(client: TwitchClient) {
		this._client = client;
	}
}
