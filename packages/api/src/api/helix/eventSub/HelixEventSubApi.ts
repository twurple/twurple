import type { HelixPaginatedResponseWithTotal } from '@twurple/api-call';
import { createBroadcasterQuery } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import {
	createEventSubModeratorCondition,
	createEventSubRewardCondition,
	type HelixEventSubSubscriptionData,
	type HelixEventSubSubscriptionStatus,
	type HelixPaginatedEventSubSubscriptionsResponse
} from '../../../interfaces/helix/eventSub.external';
import {
	type HelixEventSubTransportOptions,
	type HelixPaginatedEventSubSubscriptionsResult
} from '../../../interfaces/helix/eventSub.input';
import { createSingleKeyQuery } from '../../../interfaces/helix/generic.external';
import { BaseApi } from '../../BaseApi';
import { createPaginatedResultWithTotal } from '../HelixPaginatedResult';
import type { HelixPagination } from '../HelixPagination';
import { createPaginationQuery } from '../HelixPagination';
import { HelixEventSubSubscription } from './HelixEventSubSubscription';
import { HelixPaginatedEventSubSubscriptionsRequest } from './HelixPaginatedEventSubSubscriptionsRequest';

/**
 * The API methods that deal with EventSub.
 *
 * Can be accessed using `client.eventSub` on an {@link ApiClient} instance.
 *
 * ## Before using these methods...
 *
 * All methods in this class assume that you are already running a working EventSub listener reachable using the given transport.
 *
 * If you don't already have one, we recommend use of the `@twurple/eventsub-http` or `@twurple/eventsub-ws` libraries,
 * which handle subscribing and unsubscribing to these topics automatically.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * await api.eventSub.subscribeToUserFollowsTo('125328655', { callbackUrl: 'https://example.com' });
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle EventSub
 */
@rtfm('api', 'HelixEventSubApi')
export class HelixEventSubApi extends BaseApi {
	/**
	 * Retrieves the current EventSub subscriptions for the current client.
	 *
	 * Requires an app access token to work; does not work with user tokens.
	 *
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getSubscriptions(pagination?: HelixPagination): Promise<HelixPaginatedEventSubSubscriptionsResult> {
		const result = await this._client.callApi<HelixPaginatedEventSubSubscriptionsResponse>({
			type: 'helix',
			url: 'eventsub/subscriptions',
			query: createPaginationQuery(pagination)
		});

		return {
			...createPaginatedResultWithTotal(result, HelixEventSubSubscription, this._client),
			totalCost: result.total_cost,
			maxTotalCost: result.max_total_cost
		};
	}

	/**
	 * Creates a paginator for the current EventSub subscriptions for the current client.
	 *
	 * Requires an app access token to work; does not work with user tokens.
	 */
	getSubscriptionsPaginated(): HelixPaginatedEventSubSubscriptionsRequest {
		return new HelixPaginatedEventSubSubscriptionsRequest({}, this._client);
	}

	/**
	 * Retrieves the current EventSub subscriptions with the given status for the current client.
	 *
	 * Requires an app access token to work; does not work with user tokens.
	 *
	 * @param status The status of the subscriptions to retrieve.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getSubscriptionsForStatus(
		status: HelixEventSubSubscriptionStatus,
		pagination?: HelixPagination
	): Promise<HelixPaginatedEventSubSubscriptionsResult> {
		const result = await this._client.callApi<HelixPaginatedEventSubSubscriptionsResponse>({
			type: 'helix',
			url: 'eventsub/subscriptions',
			query: {
				...createPaginationQuery(pagination),
				status
			}
		});

		return {
			...createPaginatedResultWithTotal(result, HelixEventSubSubscription, this._client),
			totalCost: result.total_cost,
			maxTotalCost: result.max_total_cost
		};
	}

	/**
	 * Creates a paginator for the current EventSub subscriptions with the given status for the current client.
	 *
	 * Requires an app access token to work; does not work with user tokens.
	 *
	 * @param status The status of the subscriptions to retrieve.
	 */
	getSubscriptionsForStatusPaginated(
		status: HelixEventSubSubscriptionStatus
	): HelixPaginatedEventSubSubscriptionsRequest {
		return new HelixPaginatedEventSubSubscriptionsRequest({ status }, this._client);
	}

	/**
	 * Retrieves the current EventSub subscriptions with the given type for the current client.
	 *
	 * Requires an app access token to work; does not work with user tokens.
	 *
	 * @param type The type of the subscriptions to retrieve.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getSubscriptionsForType(
		type: string,
		pagination?: HelixPagination
	): Promise<HelixPaginatedEventSubSubscriptionsResult> {
		const result = await this._client.callApi<HelixPaginatedEventSubSubscriptionsResponse>({
			type: 'helix',
			url: 'eventsub/subscriptions',
			query: {
				...createPaginationQuery(pagination),
				type
			}
		});

		return {
			...createPaginatedResultWithTotal(result, HelixEventSubSubscription, this._client),
			totalCost: result.total_cost,
			maxTotalCost: result.max_total_cost
		};
	}

	/**
	 * Creates a paginator for the current EventSub subscriptions with the given type for the current client.
	 *
	 * Requires an app access token to work; does not work with user tokens.
	 *
	 * @param type The type of the subscriptions to retrieve.
	 */
	getSubscriptionsForTypePaginated(type: string): HelixPaginatedEventSubSubscriptionsRequest {
		return new HelixPaginatedEventSubSubscriptionsRequest({ type }, this._client);
	}

	/**
	 * Retrieves the current EventSub subscriptions for the current user and client.
	 *
	 * Requires an app access token to work; does not work with user tokens.
	 *
	 * @param user The user to retrieve subscriptions for.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getSubscriptionsForUser(
		user: UserIdResolvable,
		pagination?: HelixPagination
	): Promise<HelixPaginatedEventSubSubscriptionsResult> {
		const result = await this._client.callApi<HelixPaginatedEventSubSubscriptionsResponse>({
			type: 'helix',
			url: 'eventsub/subscriptions',
			query: {
				...createSingleKeyQuery('user_id', extractUserId(user)),
				...createPaginationQuery(pagination)
			}
		});

		return {
			...createPaginatedResultWithTotal(result, HelixEventSubSubscription, this._client),
			totalCost: result.total_cost,
			maxTotalCost: result.max_total_cost
		};
	}

	/**
	 * Creates a paginator for the current EventSub subscriptions with the given type for the current client.
	 *
	 * Requires an app access token to work; does not work with user tokens.
	 *
	 * @param user The user to retrieve subscriptions for.
	 */
	getSubscriptionsForUserPaginated(user: UserIdResolvable): HelixPaginatedEventSubSubscriptionsRequest {
		return new HelixPaginatedEventSubSubscriptionsRequest(
			createSingleKeyQuery('user_id', extractUserId(user)) as Record<string, string>,
			this._client
		);
	}

	/**
	 * Sends an arbitrary request to subscribe to an event.
	 *
	 * Requires an app access token to work; does not work with user tokens.
	 *
	 * @param type The type of the event.
	 * @param version The version of the event.
	 * @param condition The condition of the subscription.
	 * @param transport The transport of the subscription.
	 * @param requiredScope The scope required by the subscription. Will only be checked for applicable transports.
	 */
	async createSubscription(
		type: string,
		version: string,
		condition: Record<string, unknown>,
		transport: HelixEventSubTransportOptions,
		requiredScope?: string
	): Promise<HelixEventSubSubscription> {
		const scope = transport.method === 'websocket' ? requiredScope : undefined;
		const result = await this._client.callApi<HelixPaginatedResponseWithTotal<HelixEventSubSubscriptionData>>({
			type: 'helix',
			url: 'eventsub/subscriptions',
			method: 'POST',
			scope,
			jsonBody: {
				type,
				version,
				condition,
				transport
			}
		});

		return new HelixEventSubSubscription(result.data[0], this._client);
	}

	/**
	 * Deletes a subscription.
	 *
	 * @param id The ID of the subscription.
	 */
	async deleteSubscription(id: string): Promise<void> {
		await this._client.callApi<HelixPaginatedResponseWithTotal<HelixEventSubSubscriptionData>>({
			type: 'helix',
			url: 'eventsub/subscriptions',
			method: 'DELETE',
			query: {
				id
			}
		});
	}

	/**
	 * Deletes *all* subscriptions.
	 */
	async deleteAllSubscriptions(): Promise<void> {
		await this._deleteSubscriptionsWithCondition();
	}

	/**
	 * Deletes all broken subscriptions, i.e. all that are not enabled or pending verification.
	 */
	async deleteBrokenSubscriptions(): Promise<void> {
		await this._deleteSubscriptionsWithCondition(
			sub => sub.status !== 'enabled' && sub.status !== 'webhook_callback_verification_pending'
		);
	}

	/**
	 * Subscribe to events that represent a stream going live.
	 *
	 * @param broadcaster The broadcaster you want to listen to online events for.
	 * @param transport The transport options
	 */
	async subscribeToStreamOnlineEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription('stream.online', '1', createBroadcasterQuery(broadcaster), transport);
	}

	/**
	 * Subscribe to events that represent a stream going offline.
	 *
	 * @param broadcaster The broadcaster you want to listen to online events for.
	 * @param transport The transport options
	 */
	async subscribeToStreamOfflineEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription('stream.offline', '1', createBroadcasterQuery(broadcaster), transport);
	}

	/**
	 * Subscribe to events that represent a channel updating their metadata.
	 *
	 * @param broadcaster The broadcaster you want to listen to update events for.
	 * @param transport The transport options
	 */
	async subscribeToChannelUpdateEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription('channel.update', '1', createBroadcasterQuery(broadcaster), transport);
	}

	/**
	 * Subscribe to events that represent a user following a channel.
	 *
	 * @param broadcaster  The broadcaster you want to listen to follow events for.
	 * @param transport The transport options
	 */
	async subscribeToChannelFollowEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription('channel.follow', '1', createBroadcasterQuery(broadcaster), transport);
	}

	/**
	 * Subscribe to events that represent a user subscribing to a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to subscribe events for.
	 * @param transport The transport options
	 */
	async subscribeToChannelSubscriptionEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.subscribe',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:subscriptions'
		);
	}

	/**
	 * Subscribe to events that represent a user gifting another user a subscription to a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to subscription gift events for.
	 * @param transport The transport options
	 */
	async subscribeToChannelSubscriptionGiftEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.subscription.gift',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:subscriptions'
		);
	}

	/**
	 * Subscribe to events that represent a user's subscription to a channel being announced.
	 *
	 * @param broadcaster The broadcaster you want to listen to subscription message events for.
	 * @param transport The transport options
	 */
	async subscribeToChannelSubscriptionMessageEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.subscription.message',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:subscriptions'
		);
	}

	/**
	 * Subscribe to events that represent a user's subscription to a channel ending.
	 *
	 * @param broadcaster The broadcaster you want to listen to subscription end events for.
	 * @param transport The transport options
	 */
	async subscribeToChannelSubscriptionEndEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.subscription.end',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:subscriptions'
		);
	}

	/**
	 * Subscribe to events that represent a user cheering bits to a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to cheer events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelCheerEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.cheer',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'bits:read'
		);
	}

	/**
	 * Subscribe to events that represent a charity campaign starting in a channel.
	 *
	 * @beta
	 * @param broadcaster The broadcaster you want to listen to charity donation events for.
	 * @param transport The transport option.
	 */
	async subscribeToChannelCharityCampaignStartEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.charity_campaign.start',
			'beta',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:charity'
		);
	}

	/**
	 * Subscribe to events that represent a charity campaign ending in a channel.
	 *
	 * @beta
	 * @param broadcaster The broadcaster you want to listen to charity donation events for.
	 * @param transport The transport option.
	 */
	async subscribeToChannelCharityCampaignStopEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.charity_campaign.stop',
			'beta',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:charity'
		);
	}

	/**
	 * Subscribe to events that represent a user donating to a charity campaign in a channel.
	 *
	 * @beta
	 * @param broadcaster The broadcaster you want to listen to charity donation events for.
	 * @param transport The transport option.
	 */
	async subscribeToChannelCharityDonationEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.charity_campaign.donate',
			'beta',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:charity'
		);
	}

	/**
	 * Subscribe to events that represent a charity campaign progressing in a channel.
	 *
	 * @beta
	 * @param broadcaster The broadcaster you want to listen to charity donation events for.
	 * @param transport The transport option.
	 */
	async subscribeToChannelCharityCampaignProgressEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.charity_campaign.progress',
			'beta',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:charity'
		);
	}

	/**
	 * Subscribe to events that represent a user being banned in a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to ban events for.
	 * @param transport The transport option.
	 */
	async subscribeToChannelBanEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.ban',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:moderate'
		);
	}

	/**
	 * Subscribe to events that represent a user being unbanned in a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to unban events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelUnbanEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.unban',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:moderate'
		);
	}

	/**
	 * Subscribe to events that represent Shield Mode being activated in a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to Shield Mode activation events for.
	 * @param moderator A user that has permission to read Shield Mode status in the broadcaster's channel.
	 * @param transport The transport options.
	 *
	 * @beta
	 */
	async subscribeToChannelShieldModeBeginEvents(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.shield_mode.begin',
			'beta',
			createEventSubModeratorCondition(broadcaster, moderator),
			transport,
			'moderator:read:shield_mode'
		);
	}

	/**
	 * Subscribe to events that represent Shield Mode being deactivated in a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to Shield Mode deactivation events for.
	 * @param moderator A user that has permission to read Shield Mode status in the broadcaster's channel.
	 * @param transport The transport options.
	 *
	 * @beta
	 */
	async subscribeToChannelShieldModeEndEvents(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.shield_mode.end',
			'beta',
			createEventSubModeratorCondition(broadcaster, moderator),
			transport,
			'moderator:read:shield_mode'
		);
	}

	/**
	 * Subscribe to events that represent a moderator being added to a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen for moderator add events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelModeratorAddEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.moderator.add',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'moderation:read'
		);
	}

	/**
	 * Subscribe to events that represent a moderator being removed from a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen for moderator remove events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelModeratorRemoveEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.moderator.remove',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'moderation:read'
		);
	}

	/**
	 * Subscribe to events that represent a broadcaster raiding another broadcaster.
	 *
	 * @param broadcaster The broadcaster you want to listen to outgoing raid events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelRaidEventsFrom(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.raid',
			'1',
			createSingleKeyQuery('from_broadcaster_user_id', extractUserId(broadcaster)),
			transport
		);
	}

	/**
	 * Subscribe to events that represent a broadcaster being raided by another broadcaster.
	 *
	 * @param broadcaster The broadcaster you want to listen to incoming raid events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelRaidEventsTo(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.raid',
			'1',
			createSingleKeyQuery('to_broadcaster_user_id', extractUserId(broadcaster)),
			transport
		);
	}

	/**
	 * Subscribe to events that represent a Channel Points reward being added to a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to reward add events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelRewardAddEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.channel_points_custom_reward.add',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:redemptions'
		);
	}

	/**
	 * Subscribe to events that represent a Channel Points reward being updated in a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to reward update events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelRewardUpdateEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.channel_points_custom_reward.update',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:redemptions'
		);
	}

	/**
	 * Subscribe to events that represent a specific Channel Points reward being updated.
	 *
	 * @param broadcaster The broadcaster you want to listen to reward update events for.
	 * @param rewardId The ID of the reward you want to listen to update events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelRewardUpdateEventsForReward(
		broadcaster: UserIdResolvable,
		rewardId: string,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.channel_points_custom_reward.update',
			'1',
			createEventSubRewardCondition(broadcaster, rewardId),
			transport,
			'channel:read:redemptions'
		);
	}

	/**
	 * Subscribe to events that represent a Channel Points reward being removed from a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to reward remove events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelRewardRemoveEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.channel_points_custom_reward.remove',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:redemptions'
		);
	}

	/**
	 * Subscribe to events that represent a specific Channel Points reward being removed from a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to reward remove events for.
	 * @param rewardId The ID of the reward you want to listen to remove events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelRewardRemoveEventsForReward(
		broadcaster: UserIdResolvable,
		rewardId: string,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.channel_points_custom_reward.remove',
			'1',
			createEventSubRewardCondition(broadcaster, rewardId),
			transport,
			'channel:read:redemptions'
		);
	}

	/**
	 * Subscribe to events that represent a Channel Points reward being redeemed.
	 *
	 * @param broadcaster The broadcaster you want to listen to redemption events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelRedemptionAddEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.channel_points_custom_reward_redemption.add',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:redemptions'
		);
	}

	/**
	 * Subscribe to events that represent a specific Channel Points reward being redeemed.
	 *
	 * @param broadcaster The broadcaster you want to listen to redemption events for.
	 * @param rewardId The ID of the reward you want to listen to redemption events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelRedemptionAddEventsForReward(
		broadcaster: UserIdResolvable,
		rewardId: string,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.channel_points_custom_reward_redemption.add',
			'1',
			createEventSubRewardCondition(broadcaster, rewardId),
			transport,
			'channel:read:redemptions'
		);
	}

	/**
	 * Subscribe to events that represent a Channel Points redemption being updated.
	 *
	 * @param broadcaster The broadcaster you want to listen to redemption update events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelRedemptionUpdateEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.channel_points_custom_reward_redemption.update',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:redemptions'
		);
	}

	/**
	 * Subscribe to events that represent a specific Channel Points reward's redemption being updated.
	 *
	 * @param broadcaster The broadcaster you want to listen to redemption update events for.
	 * @param rewardId The ID of the reward you want to listen to redemption updates for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelRedemptionUpdateEventsForReward(
		broadcaster: UserIdResolvable,
		rewardId: string,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.channel_points_custom_reward_redemption.update',
			'1',
			createEventSubRewardCondition(broadcaster, rewardId),
			transport,
			'channel:read:redemptions'
		);
	}

	/**
	 * Subscribe to events that represent a poll starting in a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to poll begin events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelPollBeginEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.poll.begin',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:polls'
		);
	}

	/**
	 * Subscribe to events that represent a poll being voted on in a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to poll progress events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelPollProgressEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.poll.progress',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:polls'
		);
	}

	/**
	 * Subscribe to events that represent a poll ending in a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to poll end events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelPollEndEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.poll.end',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:polls'
		);
	}

	/**
	 * Subscribe to events that represent a prediction starting in a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to prediction begin events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelPredictionBeginEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.prediction.begin',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:predictions'
		);
	}

	/**
	 * Subscribe to events that represent a prediction being voted on in a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to prediction preogress events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelPredictionProgressEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.prediction.progress',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:predictions'
		);
	}

	/**
	 * Subscribe to events that represent a prediction being locked in a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to prediction lock events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelPredictionLockEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.prediction.lock',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:predictions'
		);
	}

	/**
	 * Subscribe to events that represent a prediction ending in a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to prediction end events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelPredictionEndEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.prediction.end',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:predictions'
		);
	}

	/**
	 * Subscribe to events that represent the beginning of a creator goal event in a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to goal begin events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelGoalBeginEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.goal.begin',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:goals'
		);
	}

	/**
	 * Subscribe to events that represent progress towards a creator goal.
	 *
	 * @param broadcaster The broadcaster for which you want to listen to goal progress events.
	 * @param transport The transport options.
	 */
	async subscribeToChannelGoalProgressEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.goal.progress',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:goals'
		);
	}

	/**
	 * Subscribe to events that represent the end of a creator goal event.
	 *
	 * @param broadcaster The broadcaster for which you want to listen to goal end events.
	 * @param transport The transport options.
	 */
	async subscribeToChannelGoalEndEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.goal.end',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:goals'
		);
	}

	/**
	 * Subscribe to events that represent the beginning of a Hype Train event in a channel.
	 *
	 * @param broadcaster The broadcaster you want to listen to Hype train begin events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelHypeTrainBeginEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.hype_train.begin',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:hype_train'
		);
	}

	/**
	 * Subscribe to events that represent progress towards the Hype Train goal.
	 *
	 * @param broadcaster The broadcaster for which you want to listen to Hype Train progress events.
	 * @param transport The transport options.
	 */
	async subscribeToChannelHypeTrainProgressEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.hype_train.progress',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:hype_train'
		);
	}

	/**
	 * Subscribe to events that represent the end of a Hype Train event.
	 *
	 * @param broadcaster The broadcaster for which you want to listen to Hype Train end events.
	 * @param transport The transport options.
	 */
	async subscribeToChannelHypeTrainEndEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'channel.hype_train.end',
			'1',
			createBroadcasterQuery(broadcaster),
			transport,
			'channel:read:hype_train'
		);
	}

	/**
	 * Subscribe to events that represent an extension Bits transaction.
	 *
	 * @param clientId The Client ID for the extension you want to listen to Bits transactions for.
	 * @param transport The transport options.
	 */
	async subscribeToExtensionBitsTransactionCreateEvents(
		clientId: string,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'extension.bits_transaction.create',
			'1',
			createSingleKeyQuery('extension_client_id', clientId),
			transport
		);
	}

	/**
	 * Subscribe to events that represent a user granting authorization to an application.
	 *
	 * @param clientId The Client ID for the application you want to listen to authorization grant events for.
	 * @param transport The transport options.
	 */
	async subscribeToUserAuthorizationGrantEvents(
		clientId: string,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'user.authorization.grant',
			'1',
			createSingleKeyQuery('client_id', clientId),
			transport
		);
	}

	/**
	 * Subscribe to events that represent a user revoking their authorization from an application.
	 *
	 * @param clientId The Client ID for the application you want to listen to authorization revoke events for.
	 * @param transport The transport options.
	 */
	async subscribeToUserAuthorizationRevokeEvents(
		clientId: string,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'user.authorization.revoke',
			'1',
			createSingleKeyQuery('client_id', clientId),
			transport
		);
	}

	/**
	 * Subscribe to events that represent a user updating their account details.
	 *
	 * @param user The user you want to listen to user update events for.
	 * @param transport The transport options.
	 * @param withEmail Whether to request adding the email address of the user to the notification.
	 *
	 * Only has an effect with the websocket transport.
	 * With the webhook transport, this depends solely on the previous authorization given by the user.
	 */
	async subscribeToUserUpdateEvents(
		user: UserIdResolvable,
		transport: HelixEventSubTransportOptions,
		withEmail?: boolean
	): Promise<HelixEventSubSubscription> {
		return await this.createSubscription(
			'user.update',
			'1',
			createSingleKeyQuery('user_id', extractUserId(user)),
			transport,
			withEmail ? 'user:read:email' : undefined
		);
	}

	private async _deleteSubscriptionsWithCondition(cond?: (sub: HelixEventSubSubscription) => boolean): Promise<void> {
		const subsPaginator = this.getSubscriptionsPaginated();

		for await (const sub of subsPaginator) {
			if (!cond || cond(sub)) {
				await sub.unsubscribe();
			}
		}
	}
}
