import BaseAPI from '../BaseAPI';
import { Cacheable, CachedGetter } from '../../Toolkit/Decorators';

import HelixStreamAPI from './Stream/HelixStreamAPI';
import HelixUserAPI from './User/HelixUserAPI';

/**
 * Groups all API calls available in Helix a.k.a. the "New Twitch API".
 *
 * Can be accessed using {@TwitchClient#helix}.
 */
@Cacheable
export default class HelixAPIGroup extends BaseAPI {
	/**
	 * The Helix stream API methods.
	 */
	@CachedGetter()
	get streams() {
		return new HelixStreamAPI(this._client);
	}

	/**
	 * The Helix user API methods.
	 */
	@CachedGetter()
	get users() {
		return new HelixUserAPI(this._client);
	}
}
