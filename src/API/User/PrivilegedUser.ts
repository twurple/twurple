import User, { UserData } from './User';
import { UserIdResolvable } from '../../Toolkit/UserTools';
import UserFollow from './UserFollow';
import UserBlock from './UserBlock';

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
	 * Follows a channel.
	 *
	 * @param channel The channel to follow.
	 * @param notifications Whether the user will receive notifications.
	 */
	async followChannel(channel: UserIdResolvable, notifications?: boolean): Promise<UserFollow> {
		return this._client.users.followChannel(this, channel, notifications);
	}

	/**
	 * Unfollows a channel.
	 *
	 * @param channel The channel to unfollow.
	 */
	async unfollowChannel(channel: UserIdResolvable): Promise<void> {
		return this._client.users.unfollowChannel(this, channel);
	}

	/**
	 * Blocks a user.
	 *
	 * @param userToBlock The user to block.
	 */
	async blockUser(userToBlock: UserIdResolvable): Promise<UserBlock> {
		return this._client.users.blockUser(this, userToBlock);
	}

	/**
	 * Unblocks a user.
	 *
	 * @param userToUnblock The user to unblock.
	 */
	async unblockUser(userToUnblock: UserIdResolvable) {
		return this._client.users.unblockUser(this, userToUnblock);
	}
}
