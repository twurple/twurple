/** @private */
export function toUserName(channel: string): string {
	// it's okay if this is already a user name, we only remove the first character if it's a pound
	const name = channel.replace(/^#/, '').toLowerCase();
	// valid usernames must be alphanumberic or underscores between 4 and 25 characters (cannot start with underscore)
	const re = RegExp(/^[a-zA-Z0-9][a-zA-Z0-9_]{3,24}$/);
	if (!re.test(name)) {
		throw new Error(
			'Invalid channel or username. It must be made from alphanumberic characters and between 4 and 25 characters in length. Usernames and channels names cannot start with an underscore.'
		);
	}
	return name;
}

/** @private */
export function toChannelName(user: string): string {
	// remove leading pound first - in case it already is a channel name
	return `#${toUserName(user)}`;
}
