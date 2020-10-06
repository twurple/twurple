/** @private */
export function toUserName(channel: string): string {
	// it's okay if this is already a user name, we only remove the first character if it's a pound
	return channel.replace(/^#/, '').toLowerCase();
}

/** @private */
export function toChannelName(user: string): string {
	// remove leading pound first - in case it already is a channel name
	return `#${toUserName(user)}`;
}
