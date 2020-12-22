import { TwitchApiCallType } from 'twitch-api-call';
import { rtfm } from 'twitch-common';
import type { UserIdResolvable } from '../../../Toolkit/UserTools';
import { extractUserId } from '../../../Toolkit/UserTools';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequestWithTotal } from '../HelixPaginatedRequestWithTotal';
import type { HelixPaginatedResultWithTotal } from '../HelixPaginatedResult';
import { createPaginatedResultWithTotal } from '../HelixPaginatedResult';
import type { HelixPaginatedResponseWithTotal } from '../HelixResponse';
import type { HelixEventSubSubscriptionData, HelixEventSubWebHookTransportData } from './HelixEventSubSubscription';
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
	 */
	async getSubscriptions(): Promise<HelixPaginatedResultWithTotal<HelixEventSubSubscription>> {
		const result = await this._client.callApi<HelixPaginatedResponseWithTotal<HelixEventSubSubscriptionData>>({
			type: TwitchApiCallType.Helix,
			url: 'eventsub/subscriptions'
		});

		return createPaginatedResultWithTotal(result, HelixEventSubSubscription, this._client);
	}

	/**
	 * Retrieves the current WebHook subscriptions for the current client.
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
	 * @param transport The transport options
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
			'channel.channel_points_custom_rewards.remove',
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
	 * @param transport The transport events.
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
}
