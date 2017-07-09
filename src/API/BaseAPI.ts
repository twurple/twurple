import {NonEnumerable} from '../Toolkit/Decorators';
import Twitch from '../';

export default class BaseAPI {
	@NonEnumerable protected _client: Twitch;

	constructor(client: Twitch) {
		this._client = client;
	}
}
