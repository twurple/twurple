import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
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
export class KrakenApiGroup extends BaseApi {
	/**
	 * The API methods that deal with bits.
	 */
	@CachedGetter()
	get bits() {
		return new BitsApi(this._client);
	}

	/**
	 * The API methods that deal with channels.
	 */
	@CachedGetter()
	get channels() {
		return new ChannelApi(this._client);
	}

	/**
	 * The API methods that deal with chat.
	 */
	@CachedGetter()
	get chat() {
		return new ChatApi(this._client);
	}

	/**
	 * The API methods that deal with searching.
	 */
	@CachedGetter()
	get search() {
		return new SearchApi(this._client);
	}

	/**
	 * The API methods that deal with streams.
	 */
	@CachedGetter()
	get streams() {
		return new StreamApi(this._client);
	}

	/**
	 * The API methods that deal with teams.
	 */
	@CachedGetter()
	get teams() {
		return new TeamApi(this._client);
	}

	/**
	 * The API methods that deal with videos.
	 */
	@CachedGetter()
	get videos() {
		return new VideoApi(this._client);
	}

	/**
	 * The API methods that deal with users.
	 */
	@CachedGetter()
	get users() {
		return new UserApi(this._client);
	}
}
