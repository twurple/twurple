import { Enumerable } from '@d-fischer/shared-utils';
import type { HelixUserType, UserIdResolvable, UserIdResolvableType, UserNameResolveableType } from '@twurple/common';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { NoSubscriptionProgramError } from '../../../Errors/NoSubscriptionProgramError';
import type { UserFollow } from '../../Kraken/User/UserFollow';
import type { HelixPaginatedResultWithTotal } from '../HelixPaginatedResult';
import type { HelixStream } from '../Stream/HelixStream';
import type { HelixSubscription } from '../Subscriptions/HelixSubscription';
import type { HelixFollow } from './HelixFollow';

/**
 * The type of a broadcaster.
 */
export type HelixBroadcasterType = 'partner' | 'affiliate' | '';

/** @private */
export interface HelixUserData {
	id: string;
	login: string;
	display_name: string;
	description: string;
	type: HelixUserType;
	broadcaster_type: HelixBroadcasterType;
	profile_image_url: string;
	offline_image_url: string;
	view_count: number;
	created_at: string;
}

/**
 * A Twitch user.
 */
@rtfm<HelixUser>('api', 'HelixUser', 'id')
export class HelixUser implements UserIdResolvableType, UserNameResolveableType {
	/** @private */ @Enumerable(false) protected readonly _data: HelixUserData;
	/** @private */ @Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixUserData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/** @private */
	get cacheKey(): string {
		return this._data.id;
	}

	/**
	 * The ID of the user.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The name of the user.
	 */
	get name(): string {
		return this._data.login;
	}

	/**
	 * The display name of the user.
	 */
	get displayName(): string {
		return this._data.display_name;
	}

	/**
	 * The description of the user.
	 */
	get description(): string {
		return this._data.description;
	}

	/**
	 * The type of the user.
	 */
	get type(): HelixUserType {
		return this._data.type;
	}

	/**
	 * The type of the user.
	 */
	get broadcasterType(): string {
		return this._data.broadcaster_type;
	}

	/**
	 * The URL to the profile picture of the user.
	 */
	get profilePictureUrl(): string {
		return this._data.profile_image_url;
	}

	/**
	 * The URL to the offline video placeholder of the user.
	 */
	get offlinePlaceholderUrl(): string {
		return this._data.offline_image_url;
	}

	/**
	 * The total number of views of the user's channel.
	 */
	get views(): number {
		return this._data.view_count;
	}

	/**
	 * The date when the user was created, i.e. when they registered on Twitch.
	 */
	get creationDate(): Date {
		return new Date(this._data.created_at);
	}

	/**
	 * Retrieves the channel's stream data.
	 */
	async getStream(): Promise<HelixStream | null> {
		return await this._client.helix.streams.getStreamByUserId(this);
	}

	/**
	 * Retrieves a list of broadcasters the user follows.
	 */
	async getFollows(): Promise<HelixPaginatedResultWithTotal<HelixFollow>> {
		return await this._client.helix.users.getFollows({ user: this });
	}

	/**
	 * Retrieves the follow data of the given user to the broadcaster.
	 *
	 * @param user The user to check the follow from.
	 */
	async getFollowFrom(user: UserIdResolvable): Promise<HelixFollow | null> {
		return await this._client.helix.users.getFollowFromUserToBroadcaster(user, this);
	}

	/**
	 * Retrieves the follow data of the user to the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to check the follow to.
	 */
	async getFollowTo(broadcaster: UserIdResolvable): Promise<HelixFollow | null> {
		return await this._client.helix.users.getFollowFromUserToBroadcaster(this, broadcaster);
	}

	/**
	 * Checks whether the user is following the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to check the user's follow to.
	 */
	async follows(broadcaster: UserIdResolvable): Promise<boolean> {
		return await this._client.helix.users.userFollowsBroadcaster(this, broadcaster);
	}

	/**
	 * Checks whether the given user is following the broadcaster.
	 *
	 * @param user The user to check the broadcaster's follow from.
	 */
	async isFollowedBy(user: UserIdResolvable): Promise<boolean> {
		return await this._client.helix.users.userFollowsBroadcaster(user, this);
	}

	/**
	 * Follows the broadcaster.
	 */
	async follow(): Promise<UserFollow> {
		const currentUser = await this._client.kraken.users.getMe();
		return await currentUser.followChannel(this);
	}

	/**
	 * Unfollows the broadcaster.
	 */
	async unfollow(): Promise<void> {
		const currentUser = await this._client.kraken.users.getMe();
		await currentUser.unfollowChannel(this);
	}

	/**
	 * Retrieves the subscription data for the user to the given broadcaster, or `null` if the user is not subscribed.
	 *
	 * @param broadcaster The broadcaster you want to get the subscription data for.
	 */
	async getSubscriptionTo(broadcaster: UserIdResolvable): Promise<HelixSubscription | null> {
		return await this._client.helix.subscriptions.getSubscriptionForUser(broadcaster, this);
	}

	/**
	 * Checks whether the user is subscribed to the given broadcaster.
	 *
	 * @param broadcaster The broadcaster you want to check the subscription for.
	 */
	async isSubscribedTo(broadcaster: UserIdResolvable): Promise<boolean> {
		try {
			return (await this.getSubscriptionTo(broadcaster)) !== null;
		} catch (e) {
			if (e instanceof NoSubscriptionProgramError) {
				return false;
			}

			throw e;
		}
	}
}
