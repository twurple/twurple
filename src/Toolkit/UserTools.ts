import User from '../API/User/';
import ChannelPlaceholder from '../API/Channel/ChannelPlaceholder';

export type UserIdResolvable = string | User | ChannelPlaceholder;

export default class UserTools {
	static getUserId(user: UserIdResolvable) {
		return typeof user === 'string' ? user : user.id;
	}
}
