import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import { rtfm } from '@twurple/common';
import { BaseApi } from '../BaseApi';

import { HelixBitsApi } from './bits/HelixBitsApi';
import { HelixChannelApi } from './channel/HelixChannelApi';
import { HelixChannelPointsApi } from './channelPoints/HelixChannelPointsApi';
import { HelixChatApi } from './chat/HelixChatApi';
import { HelixClipApi } from './clip/HelixClipApi';
import { HelixEventSubApi } from './eventSub/HelixEventSubApi';
import { HelixExtensionsApi } from './extensions/HelixExtensionsApi';
import { HelixGameApi } from './game/HelixGameApi';
import { HelixHypeTrainApi } from './hypeTrain/HelixHypeTrainApi';
import { HelixModerationApi } from './moderation/HelixModerationApi';
import { HelixSearchApi } from './search/HelixSearchApi';
import { HelixStreamApi } from './stream/HelixStreamApi';
import { HelixSubscriptionApi } from './subscriptions/HelixSubscriptionApi';
import { HelixTagApi } from './tag/HelixTagApi';
import { HelixTeamApi } from './team/HelixTeamApi';
import { HelixUserApi } from './user/HelixUserApi';
import { HelixVideoApi } from './video/HelixVideoApi';

/**
 * Groups all API calls available in Helix a.k.a. the "New Twitch API".
 *
 * Can be accessed using {@ApiClient#helix}.
 *
 * @deprecated Please remove `.helix` from your calls to access the API namespaces directly.
 */
@Cacheable
@rtfm('api', 'HelixApiGroup')
export class HelixApiGroup extends BaseApi {
	/**
	 * The Helix bits API methods.
	 */
	@CachedGetter()
	get bits(): HelixBitsApi {
		return new HelixBitsApi(this._client);
	}

	/**
	 * The Helix channels API methods.
	 */
	@CachedGetter()
	get channels(): HelixChannelApi {
		return new HelixChannelApi(this._client);
	}

	/**
	 * The Helix channel points API methods.
	 */
	@CachedGetter()
	get channelPoints(): HelixChannelPointsApi {
		return new HelixChannelPointsApi(this._client);
	}

	/**
	 * The Helix chat API methods.
	 */
	@CachedGetter()
	get chat(): HelixChatApi {
		return new HelixChatApi(this._client);
	}

	/**
	 * The Helix clips API methods.
	 */
	@CachedGetter()
	get clips(): HelixClipApi {
		return new HelixClipApi(this._client);
	}

	/**
	 * The Helix EventSub API methods.
	 */
	@CachedGetter()
	get eventSub(): HelixEventSubApi {
		return new HelixEventSubApi(this._client);
	}

	/**
	 * The Helix extensions API methods.
	 */
	@CachedGetter()
	get extensions(): HelixExtensionsApi {
		return new HelixExtensionsApi(this._client);
	}

	/**
	 * The Helix Hype Train API methods.
	 */
	@CachedGetter()
	get hypeTrain(): HelixHypeTrainApi {
		return new HelixHypeTrainApi(this._client);
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
	 * The Helix search API methods.
	 */
	@CachedGetter()
	get search(): HelixSearchApi {
		return new HelixSearchApi(this._client);
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
	 * The Helix tag API methods.
	 */
	@CachedGetter()
	get tags(): HelixTagApi {
		return new HelixTagApi(this._client);
	}

	/**
	 * The Helix team API methods.
	 */
	@CachedGetter()
	get teams(): HelixTeamApi {
		return new HelixTeamApi(this._client);
	}

	/**
	 * The Helix user API methods.
	 */
	@CachedGetter()
	get users(): HelixUserApi {
		return new HelixUserApi(this._client);
	}

	/**
	 * The Helix video API methods.
	 */
	@CachedGetter()
	get videos(): HelixVideoApi {
		return new HelixVideoApi(this._client);
	}
}
