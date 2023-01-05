import type { HelixResponse } from '@twurple/api-call';
import { createBroadcasterQuery } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { createRaidStartQuery, type HelixRaidData } from '../../../interfaces/helix/raid.external';
import { BaseApi } from '../../BaseApi';
import { HelixRaid } from './HelixRaid';

/**
 * The Helix API methods that deal with raids.
 *
 * Can be accessed using `client.raids` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const raid = await api.raids.startRaid('125328655', '61369223');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Raids
 */
@rtfm('api', 'HelixRaidApi')
export class HelixRaidApi extends BaseApi {
	/**
	 * Initiate a raid from a live broadcaster to another live broadcaster.
	 *
	 * @param from The raiding broadcaster.
	 * @param to The raid target.
	 */
	async startRaid(from: UserIdResolvable, to: UserIdResolvable): Promise<HelixRaid> {
		const result = await this._client.callApi<HelixResponse<HelixRaidData>>({
			type: 'helix',
			url: 'raids',
			method: 'POST',
			userId: extractUserId(from),
			scopes: ['channel:manage:raids'],
			query: createRaidStartQuery(from, to)
		});

		return new HelixRaid(result.data[0]);
	}

	/**
	 * Cancels an initiated raid.
	 *
	 * @param from The raiding broadcaster.
	 */
	async cancelRaid(from: UserIdResolvable): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'raids',
			method: 'DELETE',
			userId: extractUserId(from),
			scopes: ['channel:manage:raids'],
			query: createBroadcasterQuery(from)
		});
	}
}
