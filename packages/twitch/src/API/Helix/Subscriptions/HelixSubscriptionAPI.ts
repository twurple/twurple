import { extractUserId, UserIdResolvable } from '../../../Toolkit/UserTools';
import { TwitchAPICallType } from '../../../TwitchClient';
import BaseAPI from '../../BaseAPI';
import HelixPaginatedRequest from '../HelixPaginatedRequest';
import { createPaginatedResult } from '../HelixPaginatedResult';
import HelixResponse, { HelixPaginatedResponse } from '../HelixResponse';
import HelixSubscription, { HelixSubscriptionData } from './HelixSubscription';
import HelixSubscriptionEvent, { HelixSubscriptionEventData } from './HelixSubscriptionEvent';

/**
 * The Helix API methods that deal with subscriptions.
 *
 * Can be accessed using `client.helix.subscriptions` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = TwitchClient.withCredentials(clientId, accessToken);
 * const subscriptions = await client.helix.subscriptions.getSubscriptionsForUsers('61369223', '125328655');
 * ```
 */
export default class HelixSubscriptionAPI extends BaseAPI {
	/**
	 * Retrieves a list of all subscriptions to a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to list subscriptions to.
	 */
	async getSubscriptions(broadcaster: UserIdResolvable) {
		const result = await this._client.callAPI<HelixPaginatedResponse<HelixSubscriptionData>>({
			url: 'subscriptions',
			scope: 'channel:read:subscriptions',
			type: TwitchAPICallType.Helix,
			query: {
				broadcaster_id: extractUserId(broadcaster)
			}
		});

		return createPaginatedResult(result, HelixSubscription, this._client);
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
				scope: 'channel:read:subscriptions',
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
			scope: 'channel:read:subscriptions',
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

	/**
	 * Retrieves the most recent subscription events for a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to retrieve subscription events for.
	 */
	async getSubscriptionEventsForBroadcaster(broadcaster: UserIdResolvable) {
		return this._getSubscriptionEvents('broadcaster_id', extractUserId(broadcaster));
	}

	/**
	 * Creates a paginator for the recent subscription events for a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to retrieve subscription events for.
	 */
	getSubscriptionEventsForBroadcasterPaginated(broadcaster: UserIdResolvable) {
		return new HelixPaginatedRequest(
			{
				url: 'subscriptions/events',
				scope: 'channel:read:subscriptions',
				query: {
					broadcaster_id: extractUserId(broadcaster)
				}
			},
			this._client,
			(data: HelixSubscriptionEventData) => new HelixSubscriptionEvent(data, this._client)
		);
	}

	/**
	 * Retrieves a single subscription event by ID.
	 *
	 * @param id The event ID.
	 */
	async getSubscriptionEventById(id: string) {
		return this._getSubscriptionEvents('id', id);
	}

	private async _getSubscriptionEvents(by: 'broadcaster_id' | 'id', id: string) {
		const result = await this._client.callAPI<HelixPaginatedResponse<HelixSubscriptionEventData>>({
			type: TwitchAPICallType.Helix,
			url: 'subscriptions/events',
			scope: 'channel:read:subscriptions',
			query: {
				[by]: id
			}
		});

		return createPaginatedResult(result, HelixSubscriptionEvent, this._client);
	}
}
