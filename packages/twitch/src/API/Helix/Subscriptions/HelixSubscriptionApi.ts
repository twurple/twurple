import { TwitchApiCallType } from 'twitch-api-call';
import type { UserIdResolvable } from '../../../Toolkit/UserTools';
import { extractUserId } from '../../../Toolkit/UserTools';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixPaginatedResponse, HelixResponse } from '../HelixResponse';
import type { HelixSubscriptionData } from './HelixSubscription';
import { HelixSubscription } from './HelixSubscription';
import type { HelixSubscriptionEventData } from './HelixSubscriptionEvent';
import { HelixSubscriptionEvent } from './HelixSubscriptionEvent';

/**
 * The Helix API methods that deal with subscriptions.
 *
 * Can be accessed using `client.helix.subscriptions` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const subscription = await api.helix.subscriptions.getSubscriptionForUser('61369223', '125328655');
 * ```
 */
export class HelixSubscriptionApi extends BaseApi {
	/**
	 * Retrieves a list of all subscriptions to a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to list subscriptions to.
	 */
	async getSubscriptions(broadcaster: UserIdResolvable): Promise<HelixPaginatedResult<HelixSubscription>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixSubscriptionData>>({
			url: 'subscriptions',
			scope: 'channel:read:subscriptions',
			type: TwitchApiCallType.Helix,
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
	getSubscriptionsPaginated(
		broadcaster: UserIdResolvable
	): HelixPaginatedRequest<HelixSubscriptionData, HelixSubscription> {
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
	async getSubscriptionsForUsers(
		broadcaster: UserIdResolvable,
		users: UserIdResolvable[]
	): Promise<HelixSubscription[]> {
		const result = await this._client.callApi<HelixResponse<HelixSubscriptionData>>({
			url: 'subscriptions',
			scope: 'channel:read:subscriptions',
			type: TwitchApiCallType.Helix,
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
	async getSubscriptionForUser(
		broadcaster: UserIdResolvable,
		user: UserIdResolvable
	): Promise<HelixSubscription | null> {
		const list = await this.getSubscriptionsForUsers(broadcaster, [user]);
		return list.length ? list[0] : null;
	}

	/**
	 * Retrieves the most recent subscription events for a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to retrieve subscription events for.
	 */
	async getSubscriptionEventsForBroadcaster(
		broadcaster: UserIdResolvable
	): Promise<HelixPaginatedResult<HelixSubscriptionEvent>> {
		return this._getSubscriptionEvents('broadcaster_id', extractUserId(broadcaster));
	}

	/**
	 * Creates a paginator for the recent subscription events for a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to retrieve subscription events for.
	 */
	getSubscriptionEventsForBroadcasterPaginated(
		broadcaster: UserIdResolvable
	): HelixPaginatedRequest<HelixSubscriptionEventData, HelixSubscriptionEvent> {
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
	async getSubscriptionEventById(id: string): Promise<HelixSubscriptionEvent | null> {
		const events = await this._getSubscriptionEvents('id', id);
		return events.data[0] ?? null;
	}

	private async _getSubscriptionEvents(by: 'broadcaster_id' | 'id', id: string) {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixSubscriptionEventData>>({
			type: TwitchApiCallType.Helix,
			url: 'subscriptions/events',
			scope: 'channel:read:subscriptions',
			query: {
				[by]: id
			}
		});

		return createPaginatedResult(result, HelixSubscriptionEvent, this._client);
	}
}
