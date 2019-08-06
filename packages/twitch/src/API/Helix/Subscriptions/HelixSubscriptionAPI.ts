import BaseAPI from '../../BaseAPI';
import { extractUserId, TwitchAPICallType, UserIdResolvable } from '../../..';
import HelixPaginatedRequest from '../HelixPaginatedRequest';
import HelixSubscription, { HelixSubscriptionData } from './HelixSubscription';
import HelixResponse, { HelixPaginatedResponse } from '../HelixResponse';
import HelixPaginatedResult from '../HelixPaginatedResult';

/**
 * The Helix API methods that deal with subscriptions.
 *
 * Can be accessed using `client.helix.subscriptions` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = await TwitchClient.withCredentials(clientId, accessToken);
 * const subscriptions = await client.helix.subscriptions.getSubscriptionsForUsers('61369223', '125328655');
 * ```
 */
export default class HelixSubscriptionAPI extends BaseAPI {
	/**
	 * Retrieves a list of all subscriptions to a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to list subscriptions to.
	 */
	async getSubscriptions(broadcaster: UserIdResolvable): Promise<HelixPaginatedResult<HelixSubscription>> {
		const result = await this._client.callAPI<HelixPaginatedResponse<HelixSubscriptionData>>({
			url: 'subscriptions',
			query: {
				broadcaster_id: extractUserId(broadcaster)
			}
		});

		return {
			data: result.data.map(data => new HelixSubscription(data, this._client)),
			cursor: result.pagination && result.pagination.cursor
		};
	}

	/**
	 * Creates a paginator for all subscriptions to a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to list subscriptions to.
	 */
	getSubscriptionsPaginated(broadcaster: UserIdResolvable) {
		return new HelixPaginatedRequest(
			{
				url: 'subscriptions',
				query: {
					broadcaster_id: extractUserId(broadcaster)
				}
			},
			this._client,
			(data: HelixSubscriptionData) => new HelixSubscription(data, this._client)
		);
	}

	/**
	 * Retrieves the subset of the given user list that is subscribed to the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to find subscriptions to.
	 * @param users The users that should be checked for subscriptions.
	 */
	async getSubscriptionsForUsers(broadcaster: UserIdResolvable, users: UserIdResolvable[]) {
		const result = await this._client.callAPI<HelixResponse<HelixSubscriptionData>>({
			url: 'subscriptions',
			type: TwitchAPICallType.Helix,
			query: {
				broadcaster_id: extractUserId(broadcaster),
				user_id: users.map(extractUserId)
			}
		});

		return result.data.map(data => new HelixSubscription(data, this._client));
	}

	/**
	 * Retrieves the subscription data for a given user to a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to check.
	 * @param user The user to check.
	 */
	async getSubscriptionForUser(broadcaster: UserIdResolvable, user: UserIdResolvable) {
		const list = await this.getSubscriptionsForUsers(broadcaster, [user]);
		return list.length ? list[0] : null;
	}
}
