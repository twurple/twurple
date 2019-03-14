import User from '../API/Kraken/User/User';
import ChannelPlaceholder from '../API/Kraken/Channel/ChannelPlaceholder';
import Channel from '../API/Kraken/Channel/Channel';
import HelixUser from '../API/Helix/User/HelixUser';

export type UserIdResolvable = string | User | ChannelPlaceholder | HelixUser;
export type UserNameResolvable = string | User | Channel | HelixUser;

/**
 * Extracts the user ID from an argument that is possibly an object containing that ID.
 *
 * @param user The user ID or object.
 */
export function extractUserId(user: UserIdResolvable) {
	return typeof user === 'string' ? user : user.id;
}

/**
 * Extracts the user name from an argument that is possibly an object containing that name.
 *
 * @param user The user name or object.
 */
export function extractUserName(user: UserNameResolvable) {
	return typeof user === 'string' ? user : user.name;
}
