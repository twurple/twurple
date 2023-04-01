import type { HelixResponse } from '@twurple/api-call';
import { createBroadcasterQuery, HttpStatusCodeError } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { createChannelUsersCheckQuery } from '../../../interfaces/helix/generic.external';
import {
	createSubscriptionCheckQuery,
	type HelixPaginatedSubscriptionsResponse,
	type HelixSubscriptionData,
	type HelixUserSubscriptionData
} from '../../../interfaces/helix/subscription.external';
import { type HelixPaginatedSubscriptionsResult } from '../../../interfaces/helix/subscription.input';
import { BaseApi } from '../../BaseApi';
import { createPaginatedResultWithTotal } from '../HelixPaginatedResult';
import type { HelixForwardPagination } from '../HelixPagination';
import { createPaginationQuery } from '../HelixPagination';
import { HelixPaginatedSubscriptionsRequest } from './HelixPaginatedSubscriptionsRequest';
import { HelixSubscription } from './HelixSubscription';
import { HelixUserSubscription } from './HelixUserSubscription';

/**
 * The Helix API methods that deal with subscriptions.
 *
 * Can be accessed using `client.subscriptions` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient({ authProvider });
 * const subscription = await api.subscriptions.getSubscriptionForUser('61369223', '125328655');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Subscriptions
 */
@rtfm('api', 'HelixSubscriptionApi')
export class HelixSubscriptionApi extends BaseApi {
	/**
	 * Gets a list of all subscriptions to a given broadcaster.
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
			scopes: ['channel:read:subscriptions'],
			type: 'helix',
			userId: extractUserId(broadcaster),
			query: {
				...createBroadcasterQuery(broadcaster),
				...createPaginationQuery(pagination)
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
	getSubscriptionsPaginated(broadcaster: UserIdResolvable): HelixPaginatedSubscriptionsRequest {
		return new HelixPaginatedSubscriptionsRequest(broadcaster, this._client);
	}

	/**
	 * Gets the subset of the given user list that is subscribed to the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to find subscriptions to.
	 * @param users The users that should be checked for subscriptions.
	 */
	async getSubscriptionsForUsers(
		broadcaster: UserIdResolvable,
		users: UserIdResolvable[]
	): Promise<HelixSubscription[]> {
		const result = await this._client.callApi<HelixResponse<HelixSubscriptionData>>({
			type: 'helix',
			url: 'subscriptions',
			userId: extractUserId(broadcaster),
			scopes: ['channel:read:subscriptions'],
			query: createChannelUsersCheckQuery(broadcaster, users)
		});

		return result.data.map(data => new HelixSubscription(data, this._client));
	}

	/**
	 * Gets the subscription data for a given user to a given broadcaster.
	 *
	 * This checks with the authorization of a broadcaster.
	 * If you only have the authorization of a user, check {@link HelixSubscriptionApi#checkUserSubscription}}.
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
	 * Checks if a given user is subscribed to a given broadcaster. Returns null if not subscribed.
	 *
	 * This checks with the authorization of a user.
	 * If you only have the authorization of a broadcaster, check {@link HelixSubscriptionApi#getSubscriptionForUser}}.
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
				userId: extractUserId(user),
				scopes: ['user:read:subscriptions'],
				query: createSubscriptionCheckQuery(broadcaster, user)
			});

			return new HelixUserSubscription(result.data[0], this._client);
		} catch (e) {
			if (e instanceof HttpStatusCodeError && e.statusCode === 404) {
				return null;
			}

			throw e;
		}
	}
}
