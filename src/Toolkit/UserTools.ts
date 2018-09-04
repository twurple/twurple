import User from '../API/User/User';
import ChannelPlaceholder from '../API/Channel/ChannelPlaceholder';
import Channel from '../API/Channel/Channel';
import HelixUser from '../API/Helix/User/HelixUser';

export type UserNameResolvable = string | User | Channel | HelixUser;
export type UserIdResolvable = string | User | ChannelPlaceholder | HelixUser;

/** @private */
export default class UserTools {
	static getUserId(user: UserIdResolvable) {
		return typeof user === 'string' ? user : user.id;
	}

	static getUserName(user: UserNameResolvable) {
		return typeof user === 'string' ? user : user.name;
	}
}
