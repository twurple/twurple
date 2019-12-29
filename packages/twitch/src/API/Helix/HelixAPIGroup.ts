import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import BaseAPI from '../BaseAPI';

import HelixBitsAPI from './Bits/HelixBitsAPI';
import HelixClipAPI from './Clip/HelixClipAPI';
import HelixExtensionsAPI from './Extensions/HelixExtensionsAPI';
import HelixGameAPI from './Game/HelixGameAPI';
import HelixModerationAPI from './Moderation/HelixModerationAPI';
import HelixStreamAPI from './Stream/HelixStreamAPI';
import HelixSubscriptionAPI from './Subscriptions/HelixSubscriptionAPI';
import HelixUserAPI from './User/HelixUserAPI';
import HelixVideoAPI from './Video/HelixVideoAPI';
import HelixWebHooksAPI from './WebHooks/HelixWebHooksAPI';

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
	 * The Helix extensions API methods.
	 */
	@CachedGetter()
	get extensions() {
		return new HelixExtensionsAPI(this._client);
	}

	/**
	 * The Helix game API methods.
	 */
	@CachedGetter()
	get games() {
		return new HelixGameAPI(this._client);
	}

	/**
	 * The Helix moderation API methods.
	 */
	@CachedGetter()
	get moderation() {
		return new HelixModerationAPI(this._client);
	}

	/**
	 * The Helix stream API methods.
	 */
	@CachedGetter()
	get streams() {
		return new HelixStreamAPI(this._client);
	}

	/**
	 * The Helix subscription API methods.
	 */
	@CachedGetter()
	get subscriptions() {
		return new HelixSubscriptionAPI(this._client);
	}

	/**
	 * The Helix user API methods.
	 */
	@CachedGetter()
	get users() {
		return new HelixUserAPI(this._client);
	}

	/**
	 * The Helix WebHook API methods.
	 */
	@CachedGetter()
	get webHooks() {
		return new HelixWebHooksAPI(this._client);
	}

	/**
	 * The Helix video API methods.
	 */
	@CachedGetter()
	get videos() {
		return new HelixVideoAPI(this._client);
	}
}
