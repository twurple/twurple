import { Enumerable } from '@d-fischer/shared-utils';
import type { HelixUserType, UserIdResolvable, UserIdResolvableType, UserNameResolveableType } from '@twurple/common';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { type HelixUserData } from '../../../interfaces/helix/user.external';
import type { HelixPaginatedResultWithTotal } from '../HelixPaginatedResult';
import type { HelixStream } from '../stream/HelixStream';
import type { HelixSubscription } from '../subscriptions/HelixSubscription';
import type { HelixFollow } from './HelixFollow';

/**
 * A Twitch user.
 */
@rtfm<HelixUser>('api', 'HelixUser', 'id')
export class HelixUser extends DataObject<HelixUserData> implements UserIdResolvableType, UserNameResolveableType {
	/** @private */ @Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixUserData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/** @private */
	get cacheKey(): string {
		return this[rawDataSymbol].id;
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
	 * The type of the user.
	 */
	get broadcasterType(): string {
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
	 * The total number of views of the user's channel.
	 *
	 * @deprecated This contains stale data, as Twitch stopped counting on 2022-06-06.
	 */
	get views(): number {
		return this[rawDataSymbol].view_count;
	}

	/**
	 * The date when the user was created, i.e. when they registered on Twitch.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * Retrieves the channel's stream data.
	 */
	async getStream(): Promise<HelixStream | null> {
		return await this._client.streams.getStreamByUserId(this);
	}

	/**
	 * Retrieves a list of broadcasters the user follows.
	 */
	async getFollows(): Promise<HelixPaginatedResultWithTotal<HelixFollow>> {
		return await this._client.users.getFollows({ user: this });
	}

	/**
	 * Retrieves the follow data of the given user to the broadcaster.
	 *
	 * @param user The user to check the follow from.
	 */
	async getFollowFrom(user: UserIdResolvable): Promise<HelixFollow | null> {
		return await this._client.users.getFollowFromUserToBroadcaster(user, this);
	}

	/**
	 * Retrieves the follow data of the user to the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to check the follow to.
	 */
	async getFollowTo(broadcaster: UserIdResolvable): Promise<HelixFollow | null> {
		return await this._client.users.getFollowFromUserToBroadcaster(this, broadcaster);
	}

	/**
	 * Checks whether the user is following the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to check the user's follow to.
	 */
	async follows(broadcaster: UserIdResolvable): Promise<boolean> {
		return await this._client.users.userFollowsBroadcaster(this, broadcaster);
	}

	/**
	 * Checks whether the given user is following the broadcaster.
	 *
	 * @param user The user to check the broadcaster's follow from.
	 */
	async isFollowedBy(user: UserIdResolvable): Promise<boolean> {
		return await this._client.users.userFollowsBroadcaster(user, this);
	}

	/**
	 * Retrieves the subscription data for the user to the given broadcaster, or `null` if the user is not subscribed.
	 *
	 * @param broadcaster The broadcaster you want to get the subscription data for.
	 */
	async getSubscriptionTo(broadcaster: UserIdResolvable): Promise<HelixSubscription | null> {
		return await this._client.subscriptions.getSubscriptionForUser(broadcaster, this);
	}

	/**
	 * Checks whether the user is subscribed to the given broadcaster.
	 *
	 * @param broadcaster The broadcaster you want to check the subscription for.
	 */
	async isSubscribedTo(broadcaster: UserIdResolvable): Promise<boolean> {
		return (await this.getSubscriptionTo(broadcaster)) !== null;
	}
}
