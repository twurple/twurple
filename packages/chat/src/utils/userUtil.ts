// valid names must be alphanumberic or underscores between 1 and 25 characters (cannot start with underscore)
const validNames = /^[a-z0-9][a-z0-9_]{0,24}$/;

/**
 * Converts a chat-compatible channel name to an API-compatible username.
 *
 * @param channel The name of the channel.
 */
export function toUserName(channel: string): string {
	// it's okay if this is already a username, we only remove the first character if it's a pound
	const name = channel.replace(/^#/, '').toLowerCase();
	if (!validNames.test(name)) {
		throw new Error(
			`"${name}" is not a valid user or channel name. It must be at most 25 characters long, can only include letters, numbers and underscores, and can not start with an underscore.`
		);
	}
	return name;
}

/**
 * Converts an API-compatible username to a chat-compatible channel name.
 *
 * @param user The name of the user.
 */
export function toChannelName(user: string): string {
	// remove leading pound first - in case it already is a channel name
	return `#${toUserName(user)}`;
}
