import User from '../API/User/';
import ChannelPlaceholder from '../API/Channel/ChannelPlaceholder';

export type UserIdResolvable = string | User | ChannelPlaceholder;

export default class UserTools {
	static getUserId(user: UserIdResolvable) {
		return typeof user === 'string' ? user : user.id;
	}

	static toChannelName(user: string) {
		// remove leading pound first - in case it already is a channel name
		return '#' + this.toUserName(user);
	}

	static toUserName(channel: string) {
		// it's okay if this is already a user name, we only remove the first character if it's a pound
		return channel.replace(/^#/, '').toLowerCase();
	}
}
