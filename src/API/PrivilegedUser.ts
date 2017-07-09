import User, { UserData } from './User';

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
}
