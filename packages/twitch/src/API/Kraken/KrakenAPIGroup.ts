import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import BaseAPI from '../BaseAPI';
import BitsAPI from './Bits/BitsAPI';
import ChannelAPI from './Channel/ChannelAPI';
import ChatAPI from './Chat/ChatAPI';
import SearchAPI from './Search/SearchAPI';
import StreamAPI from './Stream/StreamAPI';
import TeamAPI from './Team/TeamAPI';
import UserAPI from './User/UserAPI';

/**
 * Groups all API calls available in Kraken v5.
 *
 * Can be accessed using {@TwitchClient#kraken}.
 */
@Cacheable
export default class KrakenAPIGroup extends BaseAPI {
	/**
	 * The API methods that deal with bits.
	 */
	@CachedGetter()
	get bits() {
		return new BitsAPI(this._client);
	}

	/**
	 * The API methods that deal with channels.
	 */
	@CachedGetter()
	get channels() {
		return new ChannelAPI(this._client);
	}

	/**
	 * The API methods that deal with chat.
	 */
	@CachedGetter()
	get chat() {
		return new ChatAPI(this._client);
	}

	/**
	 * The API methods that deal with searching.
	 */
	@CachedGetter()
	get search() {
		return new SearchAPI(this._client);
	}

	/**
	 * The API methods that deal with streams.
	 */
	@CachedGetter()
	get streams() {
		return new StreamAPI(this._client);
	}

	/**
	 * The API methods that deal with users.
	 */
	@CachedGetter()
	get users() {
		return new UserAPI(this._client);
	}

	/**
	 * The API methods that deal with teams.
	 */
	@CachedGetter()
	get teams() {
		return new TeamAPI(this._client);
	}
}
