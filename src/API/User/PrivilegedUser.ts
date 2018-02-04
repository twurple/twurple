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

export default class PrivilegedUser extends User {
	/** @private */
	protected _data: PrivilegedUserData;

	async followChannel(channel: UserIdResolvable, notifications?: boolean): Promise<UserFollow> {
		return this._client.users.followChannel(this, channel, notifications);
	}

	async unfollowChannel(channel: UserIdResolvable): Promise<void> {
		return this._client.users.unfollowChannel(this, channel);
	}

	async blockUser(userToBlock: UserIdResolvable): Promise<UserBlock> {
		return this._client.users.blockUser(this, userToBlock);
	}

	async unblockUser(userToUnblock: UserIdResolvable) {
		return this._client.users.unblockUser(this, userToUnblock);
	}
}
