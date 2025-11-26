import { Enumerable } from '@d-fischer/shared-utils';
import {
	DataObject,
	type HelixUserType,
	rawDataSymbol,
	rtfm,
	type UserIdResolvable,
	type UserIdResolvableType,
	type UserNameResolveableType,
} from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient.js';
import { type HelixBroadcasterType, type HelixUserData } from '../../interfaces/endpoints/user.external.js';
import type { HelixPaginatedResultWithTotal } from '../../utils/pagination/HelixPaginatedResult.js';
import { type HelixChannelFollower } from '../channel/HelixChannelFollower.js';
import { type HelixFollowedChannel } from '../channel/HelixFollowedChannel.js';
import type { HelixStream } from '../stream/HelixStream.js';
import { type HelixSubscription } from '../subscriptions/HelixSubscription.js';
import { type HelixUserSubscription } from '../subscriptions/HelixUserSubscription.js';

/**
 * A Twitch user.
 */
@rtfm<HelixUser>('api', 'HelixUser', 'id')
export class HelixUser extends DataObject<HelixUserData> implements UserIdResolvableType, UserNameResolveableType {
	/** @internal */ @Enumerable(false) protected readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixUserData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the user.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The name of the user.
	 */
	get name(): string {
		return this[rawDataSymbol].login;
	}

	/**
	 * The display name of the user.
	 */
	get displayName(): string {
		return this[rawDataSymbol].display_name;
	}

	/**
	 * The description of the user.
	 */
	get description(): string {
		return this[rawDataSymbol].description;
	}

	/**
	 * The type of the user.
	 */
	get type(): HelixUserType {
		return this[rawDataSymbol].type;
	}

	/**
	 * The type of the broadcaster.
	 */
	get broadcasterType(): HelixBroadcasterType {
		return this[rawDataSymbol].broadcaster_type;
	}

	/**
	 * The URL of the profile picture of the user.
	 */
	get profilePictureUrl(): string {
		return this[rawDataSymbol].profile_image_url;
	}

	/**
	 * The URL of the offline video placeholder of the user.
	 */
	get offlinePlaceholderUrl(): string {
		return this[rawDataSymbol].offline_image_url;
	}

	/**
	 * The date when the user was created, i.e. when they registered on Twitch.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * Gets the channel's stream data.
	 */
	async getStream(): Promise<HelixStream | null> {
		return await this._client.streams.getStreamByUserId(this);
	}

	/**
	 * Gets a list of broadcasters the user follows.
	 */
	async getFollowedChannels(): Promise<HelixPaginatedResultWithTotal<HelixFollowedChannel>> {
		return await this._client.channels.getFollowedChannels(this);
	}

	/**
	 * Gets the follow data of the user to the given broadcaster, or `null` if the user doesn't follow the broadcaster.
	 *
	 * This requires user authentication.
	 * For broadcaster authentication, you can use `getChannelFollower` while switching `this` and the parameter.
	 *
	 * @param broadcaster The broadcaster to check the follow to.
	 */
	async getFollowedChannel(broadcaster: UserIdResolvable): Promise<HelixFollowedChannel | null> {
		const result = await this._client.channels.getFollowedChannels(this, broadcaster);

		return result.data[0] ?? null;
	}

	/**
	 * Checks whether the user is following the given broadcaster.
	 *
	 * This requires user authentication.
	 * For broadcaster authentication, you can use `isFollowedBy` while switching `this` and the parameter.
	 *
	 * @param broadcaster The broadcaster to check the user's follow to.
	 */
	async follows(broadcaster: UserIdResolvable): Promise<boolean> {
		return (await this.getFollowedChannel(broadcaster)) !== null;
	}

	/**
	 * Gets a list of users that follow the broadcaster.
	 */
	async getChannelFollowers(): Promise<HelixPaginatedResultWithTotal<HelixChannelFollower>> {
		return await this._client.channels.getChannelFollowers(this);
	}

	/**
	 * Gets the follow data of the given user to the broadcaster, or `null` if the user doesn't follow the broadcaster.
	 *
	 * This requires broadcaster authentication.
	 * For user authentication, you can use `getFollowedChannel` while switching `this` and the parameter.
	 *
	 * @param user The user to check the follow from.
	 */
	async getChannelFollower(user: UserIdResolvable): Promise<HelixChannelFollower | null> {
		const result = await this._client.channels.getChannelFollowers(this, user);
		return result.data[0] ?? null;
	}

	/**
	 * Checks whether the given user is following the broadcaster.
	 *
	 * This requires broadcaster authentication.
	 * For user authentication, you can use `follows` while switching `this` and the parameter.
	 *
	 * @param user The user to check the broadcaster's follow from.
	 */
	async isFollowedBy(user: UserIdResolvable): Promise<boolean> {
		return (await this.getChannelFollower(user)) !== null;
	}

	/**
	 * Gets the subscription data for the user to the given broadcaster, or `null` if the user is not subscribed.
	 *
	 * This requires user authentication.
	 * For broadcaster authentication, you can use `getSubscriber` while switching `this` and the parameter.
	 *
	 * @param broadcaster The broadcaster you want to get the subscription data for.
	 */
	async getSubscriptionTo(broadcaster: UserIdResolvable): Promise<HelixUserSubscription | null> {
		return await this._client.subscriptions.checkUserSubscription(this, broadcaster);
	}

	/**
	 * Checks whether the user is subscribed to the given broadcaster.
	 *
	 * This requires user authentication.
	 * For broadcaster authentication, you can use `hasSubscriber` while switching `this` and the parameter.
	 *
	 * @param broadcaster The broadcaster you want to check the subscription for.
	 */
	async isSubscribedTo(broadcaster: UserIdResolvable): Promise<boolean> {
		return (await this.getSubscriptionTo(broadcaster)) !== null;
	}

	/**
	 * Gets the subscription data for the given user to the broadcaster, or `null` if the user is not subscribed.
	 *
	 * This requires broadcaster authentication.
	 * For user authentication, you can use `getSubscriptionTo` while switching `this` and the parameter.
	 *
	 * @param user The user you want to get the subscription data for.
	 */
	async getSubscriber(user: UserIdResolvable): Promise<HelixSubscription | null> {
		return await this._client.subscriptions.getSubscriptionForUser(this, user);
	}

	/**
	 * Checks whether the given user is subscribed to the broadcaster.
	 *
	 * This requires broadcaster authentication.
	 * For user authentication, you can use `isSubscribedTo` while switching `this` and the parameter.
	 *
	 * @param user The user you want to check the subscription for.
	 */
	async hasSubscriber(user: UserIdResolvable): Promise<boolean> {
		return (await this.getSubscriber(user)) !== null;
	}
}
