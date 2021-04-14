import type { UserIdResolvable } from '@twurple/common';
import { rtfm } from '@twurple/common';
import type { UserData } from './User';
import { User } from './User';
import type { UserBlock } from './UserBlock';
import type { UserFollow } from './UserFollow';

/** @private */
export interface UserNotificationFlags {
	email: boolean;
	push: boolean;
}

/** @private */
export interface PrivilegedUserData extends UserData {
	email: string;
	email_verified: boolean;
	notifications: UserNotificationFlags;
	partnered: boolean;
	twitter_connected: boolean;
}

/**
 * A user you have extended privileges for, i.e. the currently authenticated user.
 *
 * @inheritDoc
 */
@rtfm<PrivilegedUser>('twitch', 'PrivilegedUser', 'id')
export class PrivilegedUser extends User {
	/** @private */ protected declare readonly _data: PrivilegedUserData;

	/**
	 * The user's email address.
	 */
	get email(): string {
		return this._data.email;
	}

	/**
	 * Whether the user's email address is verified.
	 */
	get isEmailVerified(): boolean {
		return this._data.email_verified;
	}

	/**
	 * Whether the user has email notifications enabled.
	 */
	get hasEmailNotifications(): boolean {
		return this._data.notifications.email;
	}

	/**
	 * Whether the user has push notifications enabled.
	 */
	get hasPushNotifications(): boolean {
		return this._data.notifications.push;
	}

	/**
	 * Whether the user is partnered.
	 */
	get isPartnered(): boolean {
		return this._data.partnered;
	}

	/**
	 * Whether the user has a Twitter account connected.
	 */
	get hasTwitter(): boolean {
		return this._data.twitter_connected;
	}

	/**
	 * Follows a channel.
	 *
	 * @param channel The channel to follow.
	 * @param notifications Whether the user will receive notifications.
	 */
	async followChannel(channel: UserIdResolvable, notifications?: boolean): Promise<UserFollow> {
		return this._client.kraken.users.followChannel(this, channel, notifications);
	}

	/**
	 * Unfollows a channel.
	 *
	 * @param channel The channel to unfollow.
	 */
	async unfollowChannel(channel: UserIdResolvable): Promise<void> {
		return this._client.kraken.users.unfollowChannel(this, channel);
	}

	/**
	 * Blocks a user.
	 *
	 * @param userToBlock The user to block.
	 */
	async blockUser(userToBlock: UserIdResolvable): Promise<UserBlock> {
		return this._client.kraken.users.blockUser(this, userToBlock);
	}

	/**
	 * Unblocks a user.
	 *
	 * @param userToUnblock The user to unblock.
	 */
	async unblockUser(userToUnblock: UserIdResolvable): Promise<void> {
		return this._client.kraken.users.unblockUser(this, userToUnblock);
	}
}
