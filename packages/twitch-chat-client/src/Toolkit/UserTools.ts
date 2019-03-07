/** @private */
export default class UserTools {
	static toChannelName(user: string) {
		// remove leading pound first - in case it already is a channel name
		return `#${this.toUserName(user)}`;
	}

	static toUserName(channel: string) {
		// it's okay if this is already a user name, we only remove the first character if it's a pound
		return channel.replace(/^#/, '').toLowerCase();
	}
}
