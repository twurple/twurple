import type { HelixPaginatedResponse, HelixPaginatedResponseWithTotal, HelixResponse } from '@twurple/api-call';
import { HttpStatusCodeError } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import { HelixPaginatedRequestWithTotal } from '../HelixPaginatedRequestWithTotal';
import type { HelixPaginatedResult, HelixPaginatedResultWithTotal } from '../HelixPaginatedResult';
import { createPaginatedResult, createPaginatedResultWithTotal } from '../HelixPaginatedResult';
import type { HelixForwardPagination } from '../HelixPagination';
import { makePaginationQuery } from '../HelixPagination';
import type { HelixSubscriptionData } from './HelixSubscription';
import { HelixSubscription } from './HelixSubscription';
import type { HelixSubscriptionEventData } from './HelixSubscriptionEvent';
import { HelixSubscriptionEvent } from './HelixSubscriptionEvent';
import type { HelixUserSubscriptionData } from './HelixUserSubscription';
import { HelixUserSubscription } from './HelixUserSubscription';

/** @private */
export interface HelixPaginatedSubscriptionsResponse extends HelixPaginatedResponseWithTotal<HelixSubscriptionData> {
	points: number;
}

/**
 * The result of a subscription query, including the subscription data, cursor, total count and sub points.
 */
export interface HelixPaginatedSubscriptionsResult extends HelixPaginatedResultWithTotal<HelixSubscription> {
	/**
	 * The number of sub points the broadcaster currently has.
	 */
	points: number;
}

/**
 * The Helix API methods that deal with subscriptions.
 *
 * Can be accessed using `client.subscriptions` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const subscription = await api.subscriptions.getSubscriptionForUser('61369223', '125328655');
 * ```
 */
@rtfm('api', 'HelixSubscriptionApi')
export class HelixSubscriptionApi extends BaseApi {
	/**
	 * Retrieves a list of all subscriptions to a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to list subscriptions to.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getSubscriptions(
		broadcaster: UserIdResolvable,
		pagination?: HelixForwardPagination
	): Promise<HelixPaginatedSubscriptionsResult> {
		const result = await this._client.callApi<HelixPaginatedSubscriptionsResponse>({
			url: 'subscriptions',
			scope: 'channel:read:subscriptions',
			type: 'helix',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				...makePaginationQuery(pagination)
			}
		});

		return {
			...createPaginatedResultWithTotal(result, HelixSubscription, this._client),
			points: result.points
		};
	}

	/**
	 * Creates a paginator for all subscriptions to a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to list subscriptions to.
	 */
	getSubscriptionsPaginated(
		broadcaster: UserIdResolvable
	): HelixPaginatedRequestWithTotal<HelixSubscriptionData, HelixSubscription> {
		return new HelixPaginatedRequestWithTotal(
			{
				url: 'subscriptions',
				scope: 'channel:read:subscriptions',
				query: {
					broadcaster_id: extractUserId(broadcaster)
				}
			},
			this._client,
			data => new HelixSubscription(data, this._client)
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
			type: 'helix',
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
	 * This checks with the authorization of a broadcaster.
	 * If you only have the authorization of a user, check {@HelixSubscriptionApi#checkUserSubscription}.
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
	 * @param pagination
	 *
	 * @expandParams
	 *
	 * @deprecated This endpoint will be decommissioned on March 15th, 2022.
	 * Use {@HelixSubscriptionApi#getSubscriptions} and {@HelixEventSubApi} instead.
	 * [More info here](https://discuss.dev.twitch.tv/t/deprecation-of-twitch-api-event-endpoints-that-supported-websub-based-webhooks/35137)
	 */
	async getSubscriptionEventsForBroadcaster(
		broadcaster: UserIdResolvable,
		pagination?: HelixForwardPagination
	): Promise<HelixPaginatedResult<HelixSubscriptionEvent>> {
		return await this._getSubscriptionEvents('broadcaster_id', extractUserId(broadcaster), pagination);
	}

	/**
	 * Creates a paginator for the recent subscription events for a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to retrieve subscription events for.
	 *
	 * @deprecated This endpoint will be decommissioned on March 15th, 2022.
	 * Use {@HelixSubscriptionApi#getSubscriptions} and {@HelixEventSubApi} instead.
	 * [More info here](https://discuss.dev.twitch.tv/t/deprecation-of-twitch-api-event-endpoints-that-supported-websub-based-webhooks/35137)
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
			data => new HelixSubscriptionEvent(data, this._client)
		);
	}

	/**
	 * Retrieves a single subscription event by ID.
	 *
	 * @param id The event ID.
	 *
	 * @deprecated This endpoint will be decommissioned on March 15th, 2022.
	 * Use {@HelixSubscriptionApi#getSubscriptions} and {@HelixEventSubApi} instead.
	 * [More info here](https://discuss.dev.twitch.tv/t/deprecation-of-twitch-api-event-endpoints-that-supported-websub-based-webhooks/35137)
	 */
	async getSubscriptionEventById(id: string): Promise<HelixSubscriptionEvent | null> {
		const events = await this._getSubscriptionEvents('id', id);
		return events.data[0] ?? null;
	}

	/**
	 * Checks if a given user is subscribed to a given broadcaster. Returns null if not subscribed.
	 *
	 * This checks with the authorization of a user.
	 * If you only have the authorization of a broadcaster, check {@HelixSubscriptionApi#getSubscriptionForUser}.
	 *
	 * @param user The user to check.
	 * @param broadcaster The broadcaster to check the user's subscription for.
	 */
	async checkUserSubscription(
		user: UserIdResolvable,
		broadcaster: UserIdResolvable
	): Promise<HelixUserSubscription | null> {
		try {
			const result = await this._client.callApi<HelixResponse<HelixUserSubscriptionData>>({
				type: 'helix',
				url: 'subscriptions/user',
				scope: 'user:read:subscriptions',
				query: {
					broadcaster_id: extractUserId(broadcaster),
					user_id: extractUserId(user)
				}
			});

			return new HelixUserSubscription(result.data[0], this._client);
		} catch (e) {
			if (e instanceof HttpStatusCodeError && e.statusCode === 404) {
				return null;
			}

			throw e;
		}
	}

	private async _getSubscriptionEvents(by: 'broadcaster_id' | 'id', id: string, pagination?: HelixForwardPagination) {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixSubscriptionEventData>>({
			type: 'helix',
			url: 'subscriptions/events',
			scope: 'channel:read:subscriptions',
			query: {
				[by]: id,
				...makePaginationQuery(pagination)
			}
		});

		return createPaginatedResult(result, HelixSubscriptionEvent, this._client);
	}
}
