import { NonEnumerable } from '../Toolkit/Decorators';
import TwitchClient from '../TwitchClient';

export default class BaseAPI {
	@NonEnumerable protected _client: TwitchClient;

	constructor(client: TwitchClient) {
		this._client = client;
	}
}
