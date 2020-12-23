import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import { rtfm } from 'twitch-common';
import { BaseApi } from '../BaseApi';
import { BitsApi } from './Bits/BitsApi';
import { ChannelApi } from './Channel/ChannelApi';
import { ChatApi } from './Chat/ChatApi';
import { SearchApi } from './Search/SearchApi';
import { StreamApi } from './Stream/StreamApi';
import { TeamApi } from './Team/TeamApi';
import { UserApi } from './User/UserApi';
import { VideoApi } from './Video/VideoApi';

/**
 * Groups all API calls available in Kraken v5.
 *
 * Can be accessed using {@ApiClient#kraken}.
 */
@Cacheable
@rtfm('twitch', 'KrakenApiGroup')
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
