import UserTools, { UserIdResolvable } from '../../Toolkit/UserTools';
import { Cacheable, Cached } from '../../Toolkit/Decorators';
import CheermoteList, { CheermoteListData } from './CheermoteList';
import BaseAPI from '../BaseAPI';

/**
 * The API methods that deal with Bits/Cheermotes.
 *
 * Can be accessed using `client.bits` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = new TwitchClient(options);
 * const cheermotes = await client.bits.getCheermotes();
 * ```
 */
@Cacheable
export default class BitsAPI extends BaseAPI {
	/**
	 * Retrieves global and channel cheermotes.
	 *
	 * @param channel The channel you want to retrieve the available cheermotes for.
	 * If not given, this method retrieves a list of globally available cheermotes.
	 */
	@Cached(3600)
	async getCheermotes(channel?: UserIdResolvable) {
		const query: Record<string, string> = {};
		if (channel) {
			query.channel_id = UserTools.getUserId(channel);
		}

		const data = await this._client.callAPI<CheermoteListData>({ url: 'bits/actions', query });
		return new CheermoteList(data.actions, this._client);
	}
}
