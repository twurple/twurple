import User, { UserData } from './';
import { UserIdResolvable } from '../../Toolkit/UserTools';
import UserFollow from './UserFollow';

export interface UserNotificationFlags {
	email: boolean;
	push: boolean;
}

export interface PrivilegedUserData extends UserData {
	email: string;
	email_verified: boolean;
	notifications: UserNotificationFlags;
	partnered: boolean;
	twitter_connected: boolean;
}

export default class PrivilegedUser extends User {
	protected _data: PrivilegedUserData;

	async followChannel(channel: UserIdResolvable, notifications?: boolean): Promise<UserFollow> {
		return this._client.users.followChannel(this, channel, notifications);
	}

	async unfollowChannel(channel: UserIdResolvable): Promise<void> {
		return this._client.users.unfollowChannel(this, channel);
	}

	async blockUser(userToBlock: UserIdResolvable): Promise<UserFollow> {
		return this._client.users.blockUser(this, userToBlock);
	}

	async unblockUser(userToUnblock: UserIdResolvable) {
		return this._client.users.unblockUser(this, userToUnblock);
	}
}
