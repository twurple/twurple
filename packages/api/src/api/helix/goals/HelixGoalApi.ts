import type { HelixResponse } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { BaseApi } from '../../BaseApi';
import type { HelixGoalData } from './HelixGoal';
import { HelixGoal } from './HelixGoal';

/**
 * The Helix API methods that deal with creator goals.
 *
 * Can be accessed using `client.helix.goals` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const { data: goals } = await api.helix.goals.getGoals('61369223');
 */
@rtfm('api', 'HelixGoalApi')
export class HelixGoalApi extends BaseApi {
	async getGoals(broadcaster: UserIdResolvable): Promise<HelixGoal[]> {
		const result = await this._client.callApi<HelixResponse<HelixGoalData>>({
			type: 'helix',
			url: 'goals',
			query: {
				broadcaster_id: extractUserId(broadcaster)
			}
		});

		return result.data.map(data => new HelixGoal(data, this._client));
	}
}
