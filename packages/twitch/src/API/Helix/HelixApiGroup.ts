import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import { BaseApi } from '../BaseApi';

import { HelixBitsApi } from './Bits/HelixBitsApi';
import { HelixClipApi } from './Clip/HelixClipApi';
import { HelixExtensionsApi } from './Extensions/HelixExtensionsApi';
import { HelixGameApi } from './Game/HelixGameApi';
import { HelixModerationApi } from './Moderation/HelixModerationApi';
import { HelixStreamApi } from './Stream/HelixStreamApi';
import { HelixSubscriptionApi } from './Subscriptions/HelixSubscriptionApi';
import { HelixUserApi } from './User/HelixUserApi';
import { HelixVideoApi } from './Video/HelixVideoApi';
import { HelixWebHooksApi } from './WebHooks/HelixWebHooksApi';

/**
 * Groups all API calls available in Helix a.k.a. the "New Twitch API".
 *
 * Can be accessed using {@ApiClient#helix}.
 */
@Cacheable
export class HelixApiGroup extends BaseApi {
	/**
	 * The Helix bits API methods.
	 */
	@CachedGetter()
	get bits(): HelixBitsApi {
		return new HelixBitsApi(this._client);
	}

	/**
	 * The Helix clips API methods.
	 */
	@CachedGetter()
	get clips(): HelixClipApi {
		return new HelixClipApi(this._client);
	}

	/**
	 * The Helix extensions API methods.
	 */
	@CachedGetter()
	get extensions(): HelixExtensionsApi {
		return new HelixExtensionsApi(this._client);
	}

	/**
	 * The Helix game API methods.
	 */
	@CachedGetter()
	get games(): HelixGameApi {
		return new HelixGameApi(this._client);
	}

	/**
	 * The Helix moderation API methods.
	 */
	@CachedGetter()
	get moderation(): HelixModerationApi {
		return new HelixModerationApi(this._client);
	}

	/**
	 * The Helix stream API methods.
	 */
	@CachedGetter()
	get streams(): HelixStreamApi {
		return new HelixStreamApi(this._client);
	}

	/**
	 * The Helix subscription API methods.
	 */
	@CachedGetter()
	get subscriptions(): HelixSubscriptionApi {
		return new HelixSubscriptionApi(this._client);
	}

	/**
	 * The Helix user API methods.
	 */
	@CachedGetter()
	get users(): HelixUserApi {
		return new HelixUserApi(this._client);
	}

	/**
	 * The Helix WebHook API methods.
	 */
	@CachedGetter()
	get webHooks(): HelixWebHooksApi {
		return new HelixWebHooksApi(this._client);
	}

	/**
	 * The Helix video API methods.
	 */
	@CachedGetter()
	get videos(): HelixVideoApi {
		return new HelixVideoApi(this._client);
	}
}
