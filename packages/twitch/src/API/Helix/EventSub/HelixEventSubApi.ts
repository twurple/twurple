import { TwitchApiCallType } from 'twitch-api-call';
import type { UserIdResolvable } from 'twitch-common';
import { extractUserId, rtfm } from 'twitch-common';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequestWithTotal } from '../HelixPaginatedRequestWithTotal';
import type { HelixPaginatedResultWithTotal } from '../HelixPaginatedResult';
import { createPaginatedResultWithTotal } from '../HelixPaginatedResult';
import type { HelixPagination } from '../HelixPagination';
import { makePaginationQuery } from '../HelixPagination';
import type { HelixPaginatedResponseWithTotal } from '../HelixResponse';
import type {
	HelixEventSubSubscriptionData,
	HelixEventSubSubscriptionStatus,
	HelixEventSubWebHookTransportData
} from './HelixEventSubSubscription';
import { HelixEventSubSubscription } from './HelixEventSubSubscription';

/**
 * The properties describing where and how long a WebHook notification is sent, and how it is signed.
 */
export interface HelixEventSubWebHookTransportOptions extends HelixEventSubWebHookTransportData {
	/**
	 * The secret to sign the notification payloads with.
	 */
	secret?: string;
}

export type HelixEventSubTransportOptions = HelixEventSubWebHookTransportOptions;

/**
 * The API methods that deal with WebHooks.
 *
 * Can be accessed using `client.helix.eventSub` on an {@ApiClient} instance.
 *
 * ## Before using these methods...
 *
 * All of the methods in this class assume that you are already running a working EventSub listener at the given callback URL.
 *
 * If you don't already have one, we recommend use of the `twitch-eventsub` library, which handles subscribing and unsubscribing to these topics automatically.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * await api.helix.eventSub.subscribeToUserFollowsTo('125328655', { callbackUrl: 'https://example.com' });
 * ```
 */
@rtfm('twitch', 'HelixEventSubApi')
export class HelixEventSubApi extends BaseApi {
	/**
	 * Retrieves the current WebHook subscriptions for the current client.
	 *
	 * Requires an app access token to work; does not work with user tokens.
	 *
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getSubscriptions(
		pagination?: HelixPagination
	): Promise<HelixPaginatedResultWithTotal<HelixEventSubSubscription>> {
		const result = await this._client.callApi<HelixPaginatedResponseWithTotal<HelixEventSubSubscriptionData>>({
			type: TwitchApiCallType.Helix,
			url: 'eventsub/subscriptions',
			query: makePaginationQuery(pagination)
		});

		return createPaginatedResultWithTotal(result, HelixEventSubSubscription, this._client);
	}

	/**
	 * Creates a paginator for the current WebHook subscriptions for the current client.
	 *
	 * Requires an app access token to work; does not work with user tokens.
	 */
	getSubscriptionsPaginated(): HelixPaginatedRequestWithTotal<
		HelixEventSubSubscriptionData,
		HelixEventSubSubscription
	> {
		return new HelixPaginatedRequestWithTotal(
			{
				url: 'eventsub/subscriptions'
			},
			this._client,
			(data: HelixEventSubSubscriptionData) => new HelixEventSubSubscription(data, this._client)
		);
	}

	/**
	 * Retrieves the current WebHook subscriptions with the given status for the current client.
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
	): Promise<HelixPaginatedResultWithTotal<HelixEventSubSubscription>> {
		const result = await this._client.callApi<HelixPaginatedResponseWithTotal<HelixEventSubSubscriptionData>>({
			type: TwitchApiCallType.Helix,
			url: 'eventsub/subscriptions',
			query: {
				...makePaginationQuery(pagination),
				status
			}
		});

		return createPaginatedResultWithTotal(result, HelixEventSubSubscription, this._client);
	}

	/**
	 * Creates a paginator for the current WebHook subscriptions with the given status for the current client.
	 *
	 * Requires an app access token to work; does not work with user tokens.
	 *
	 * @param status The status of the subscriptions to retrieve.
	 */
	getSubscriptionsForStatusPaginated(
		status: HelixEventSubSubscriptionStatus
	): HelixPaginatedRequestWithTotal<HelixEventSubSubscriptionData, HelixEventSubSubscription> {
		return new HelixPaginatedRequestWithTotal(
			{
				url: 'eventsub/subscriptions',
				query: { status }
			},
			this._client,
			(data: HelixEventSubSubscriptionData) => new HelixEventSubSubscription(data, this._client)
		);
	}

	/**
	 * Retrieves the current WebHook subscriptions with the given type for the current client.
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
	): Promise<HelixPaginatedResultWithTotal<HelixEventSubSubscription>> {
		const result = await this._client.callApi<HelixPaginatedResponseWithTotal<HelixEventSubSubscriptionData>>({
			type: TwitchApiCallType.Helix,
			url: 'eventsub/subscriptions',
			query: {
				...makePaginationQuery(pagination),
				type
			}
		});

		return createPaginatedResultWithTotal(result, HelixEventSubSubscription, this._client);
	}

	/**
	 * Creates a paginator for the current WebHook subscriptions with the given type for the current client.
	 *
	 * Requires an app access token to work; does not work with user tokens.
	 *
	 * @param type The type of the subscriptions to retrieve.
	 */
	getSubscriptionsForTypePaginated(
		type: string
	): HelixPaginatedRequestWithTotal<HelixEventSubSubscriptionData, HelixEventSubSubscription> {
		return new HelixPaginatedRequestWithTotal(
			{
				url: 'eventsub/subscriptions',
				query: { type }
			},
			this._client,
			(data: HelixEventSubSubscriptionData) => new HelixEventSubSubscription(data, this._client)
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
	 */
	async createSubscription(
		type: string,
		version: string,
		condition: Record<string, unknown>,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		const result = await this._client.callApi<HelixPaginatedResponseWithTotal<HelixEventSubSubscriptionData>>({
			type: TwitchApiCallType.Helix,
			url: 'eventsub/subscriptions',
			method: 'POST',
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
			type: TwitchApiCallType.Helix,
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
		return this._deleteSubscriptionsWithCondition();
	}

	/**
	 * Deletes all broken subscriptions, i.e. all that are not enabled or pending verification.
	 */
	async deleteBrokenSubscriptions(): Promise<void> {
		return this._deleteSubscriptionsWithCondition(
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
		return this.createSubscription(
			'stream.online',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
		);
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
		return this.createSubscription(
			'stream.offline',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
		);
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
		return this.createSubscription(
			'channel.update',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
		);
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
		return this.createSubscription(
			'channel.follow',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
		);
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
		return this.createSubscription(
			'channel.subscribe',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.subscription.gift',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.subscription.end',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.cheer',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.ban',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.unban',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.moderator.add',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.moderator.remove',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.raid',
			'1',
			{ from_broadcaster_user_id: extractUserId(broadcaster) },
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
		return this.createSubscription(
			'channel.raid',
			'1',
			{ to_broadcaster_user_id: extractUserId(broadcaster) },
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
		return this.createSubscription(
			'channel.channel_points_custom_reward.add',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.channel_points_custom_reward.update',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.channel_points_custom_reward.update',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster), reward_id: rewardId },
			transport
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
		return this.createSubscription(
			'channel.channel_points_custom_reward.remove',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.channel_points_custom_reward.remove',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster), reward_id: rewardId },
			transport
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
		return this.createSubscription(
			'channel.channel_points_custom_reward_redemption.add',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.channel_points_custom_reward_redemption.add',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster), reward_id: rewardId },
			transport
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
		return this.createSubscription(
			'channel.channel_points_custom_reward_redemption.update',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.channel_points_custom_reward_redemption.update',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster), reward_id: rewardId },
			transport
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
		return this.createSubscription(
			'channel.poll.begin',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.poll.progress',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.poll.end',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.prediction.begin',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.prediction.progress',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.prediction.lock',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.prediction.end',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
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
		return this.createSubscription(
			'channel.hype_train.begin',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
		);
	}

	/**
	 * Subscribe to events that represent progress towards the Hype Train goal.
	 *
	 * @param broadcaster The broadcaster for which you want to listen to Hype Train progress events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelHypeTrainProgressEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return this.createSubscription(
			'channel.hype_train.progress',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
		);
	}

	/**
	 * Subscribe to events that represent the end of a Hype Train event.
	 *
	 * @param broadcaster The broadcaster for which you want to listen to Hype Train end events for.
	 * @param transport The transport options.
	 */
	async subscribeToChannelHypeTrainEndEvents(
		broadcaster: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return this.createSubscription(
			'channel.hype_train.end',
			'1',
			{ broadcaster_user_id: extractUserId(broadcaster) },
			transport
		);
	}

	/**
	 * Subscribe to events that represent a extension Bits transaction.
	 *
	 * @param clientId The Client ID for the extension you want to listen to Bits transactions for.
	 * @param transport The transport options.
	 */
	async subscribeToExtensionBitsTransactionCreateEvents(
		clientId: string,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return this.createSubscription(
			'extension.bits_transaction.create',
			'1',
			{ extension_client_id: this._client.clientId },
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
		return this.createSubscription('user.authorization.revoke', '1', { client_id: clientId }, transport);
	}

	/**
	 * Subscribe to events that represent a user updating their account details.
	 *
	 * @param user The user you want to listen to user update events for.
	 * @param transport The transport options.
	 */
	async subscribeToUserUpdateEvents(
		user: UserIdResolvable,
		transport: HelixEventSubTransportOptions
	): Promise<HelixEventSubSubscription> {
		return this.createSubscription('user.update', '1', { user_id: extractUserId(user) }, transport);
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
