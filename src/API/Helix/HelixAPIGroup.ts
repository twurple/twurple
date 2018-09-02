import BaseAPI from '../BaseAPI';
import { Cacheable, CachedGetter } from '../../Toolkit/Decorators';

import HelixStreamAPI from './Stream/HelixStreamAPI';
import HelixUserAPI from './User/HelixUserAPI';
import HelixBitsAPI from './Bits/HelixBitsAPI';
import HelixClipAPI from './Clip/HelixClipAPI';
import HelixGameAPI from './Game/HelixGameAPI';

/**
 * Groups all API calls available in Helix a.k.a. the "New Twitch API".
 *
 * Can be accessed using {@TwitchClient#helix}.
 */
@Cacheable
export default class HelixAPIGroup extends BaseAPI {
	/**
	 * The Helix bits API methods.
	 */
	@CachedGetter()
	get bits() {
		return new HelixBitsAPI(this._client);
	}

	/**
	 * The Helix clips API methods.
	 */
	@CachedGetter()
	get clips() {
		return new HelixClipAPI(this._client);
	}

	/**
	 * The Helix game API methods.
	 */
	@CachedGetter()
	get games() {
		return new HelixGameAPI(this._client);
	}

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
