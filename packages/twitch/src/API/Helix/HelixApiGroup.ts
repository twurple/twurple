import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import { rtfm } from 'twitch-common';
import { BaseApi } from '../BaseApi';

import { HelixBitsApi } from './Bits/HelixBitsApi';
import { HelixChannelApi } from './Channel/HelixChannelApi';
import { HelixChannelPointsApi } from './ChannelPoints/HelixChannelPointsApi';
import { HelixChatApi } from './Chat/HelixChatApi';
import { HelixClipApi } from './Clip/HelixClipApi';
import { HelixEventSubApi } from './EventSub/HelixEventSubApi';
import { HelixExtensionsApi } from './Extensions/HelixExtensionsApi';
import { HelixGameApi } from './Game/HelixGameApi';
import HelixHypeTrainApi from './HypeTrain/HelixHypeTrainApi';
import { HelixModerationApi } from './Moderation/HelixModerationApi';
import { HelixSearchApi } from './Search/HelixSearchApi';
import { HelixStreamApi } from './Stream/HelixStreamApi';
import { HelixSubscriptionApi } from './Subscriptions/HelixSubscriptionApi';
import { HelixTagApi } from './Tag/HelixTagApi';
import { HelixTeamApi } from './Team/HelixTeamApi';
import { HelixUserApi } from './User/HelixUserApi';
import { HelixVideoApi } from './Video/HelixVideoApi';
import { HelixWebHooksApi } from './WebHooks/HelixWebHooksApi';

/**
 * Groups all API calls available in Helix a.k.a. the "New Twitch API".
 *
 * Can be accessed using {@ApiClient#helix}.
 */
@Cacheable
@rtfm('twitch', 'HelixApiGroup')
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
