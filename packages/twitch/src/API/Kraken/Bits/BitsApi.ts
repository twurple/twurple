import { Cacheable, Cached } from '@d-fischer/cache-decorators';
import type { UserIdResolvable } from 'twitch-common';
import { extractUserId, rtfm } from 'twitch-common';
import { BaseApi } from '../../BaseApi';
import type { CheermoteListData } from './CheermoteList';
import { CheermoteList } from './CheermoteList';

/**
 * The API methods that deal with Bits/Cheermotes.
 *
 * Can be accessed using `client.kraken.bits` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const cheermotes = await api.kraken.bits.getCheermotes();
 * ```
 */
@Cacheable
@rtfm('twitch', 'BitsApi')
export class BitsApi extends BaseApi {
	/**
	 * Retrieves global and channel cheermotes.
	 *
	 * @param channel The channel you want to retrieve the available cheermotes for.
	 * If not given, this method retrieves a list of globally available cheermotes.
	 * @param includeSponsored Whether to include sponsored cheermotes in the list.
	 */
	@Cached(3600)
	async getCheermotes(channel?: UserIdResolvable, includeSponsored: boolean = true): Promise<CheermoteList> {
		const query: Record<string, string> = {};
		if (channel) {
			query.channel_id = extractUserId(channel);
		}
		if (includeSponsored) {
			query.include_sponsored = 'true';
		}

		const data = await this._client.callApi<CheermoteListData>({ url: 'bits/actions', query });
		return new CheermoteList(data.actions);
	}
}
