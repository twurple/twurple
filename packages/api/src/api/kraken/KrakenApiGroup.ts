import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import { rtfm } from '@twurple/common';
import { BaseApi } from '../BaseApi';
import { BitsApi } from './bits/BitsApi';
import { ChannelApi } from './channel/ChannelApi';
import { ChatApi } from './chat/ChatApi';
import { SearchApi } from './search/SearchApi';
import { StreamApi } from './stream/StreamApi';
import { TeamApi } from './team/TeamApi';
import { UserApi } from './user/UserApi';
import { VideoApi } from './video/VideoApi';

/**
 * Groups all API calls available in Kraken v5.
 *
 * Can be accessed using {@ApiClient#kraken}.
 */
@Cacheable
@rtfm('api', 'KrakenApiGroup')
export class KrakenApiGroup extends BaseApi {
	/**
	 * The API methods that deal with bits.
	 */
	@CachedGetter()
	get bits(): BitsApi {
		return new BitsApi(this._client);
	}

	/**
	 * The API methods that deal with channels.
	 */
	@CachedGetter()
	get channels(): ChannelApi {
		return new ChannelApi(this._client);
	}

	/**
	 * The API methods that deal with chat.
	 */
	@CachedGetter()
	get chat(): ChatApi {
		return new ChatApi(this._client);
	}

	/**
	 * The API methods that deal with searching.
	 */
	@CachedGetter()
	get search(): SearchApi {
		return new SearchApi(this._client);
	}

	/**
	 * The API methods that deal with streams.
	 */
	@CachedGetter()
	get streams(): StreamApi {
		return new StreamApi(this._client);
	}

	/**
	 * The API methods that deal with teams.
	 */
	@CachedGetter()
	get teams(): TeamApi {
		return new TeamApi(this._client);
	}

	/**
	 * The API methods that deal with videos.
	 */
	@CachedGetter()
	get videos(): VideoApi {
		return new VideoApi(this._client);
	}

	/**
	 * The API methods that deal with users.
	 */
	@CachedGetter()
	get users(): UserApi {
		return new UserApi(this._client);
	}
}
