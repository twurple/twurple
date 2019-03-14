import User, { UserData } from './User';
import { UserIdResolvable } from '../../../Toolkit/UserTools';
import UserFollow from './UserFollow';

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
export default class PrivilegedUser extends User {
	/** @private */
	protected _data: PrivilegedUserData;

	/**
	 * The user's email address.
	 */
	get email() {
		return this._data.email;
	}

	/**
	 * Whether the user's email address is verified.
	 */
	get isEmailVerified() {
		return this._data.email_verified;
	}

	/**
	 * Whether the user has email notifications enabled.
	 */
	get hasEmailNotifications() {
		return this._data.notifications.email;
	}

	/**
	 * Whether the user has push notifications enabled.
	 */
	get hasPushNotifications() {
		return this._data.notifications.push;
	}

	/**
	 * Whether the user is partnered.
	 */
	get isPartnered() {
		return this._data.partnered;
	}

	/**
	 * Whether the user has a Twitter account connected.
	 */
	get hasTwitter() {
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
	async blockUser(userToBlock: UserIdResolvable) {
		return this._client.kraken.users.blockUser(this, userToBlock);
	}

	/**
	 * Unblocks a user.
	 *
	 * @param userToUnblock The user to unblock.
	 */
	async unblockUser(userToUnblock: UserIdResolvable) {
		return this._client.kraken.users.unblockUser(this, userToUnblock);
	}
}
