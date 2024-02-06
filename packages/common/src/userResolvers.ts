/**
 * A type that represents a user and contains a user ID.
 */
export interface UserIdResolvableType {
	/**
	 * The ID of the user.
	 */
	id: string;
}

/**
 * A type that represents a user and contains a user name.
 */
export interface UserNameResolveableType {
	/**
	 * The name of the user.
	 */
	name: string;
}

/**
 * A user ID or a user or channel object.
 *
 * This is not a user name.
 * Please use {@link HelixUserApi#getUserByName} to fetch a user object by name.
 */
export type UserIdResolvable = string | number | UserIdResolvableType;

/**
 * A user name or a user or channel object.
 */
export type UserNameResolvable = string | UserNameResolveableType;

/**
 * Extracts the user ID from an argument that is possibly an object containing that ID.
 *
 * @param user The user ID or object.
 */
export function extractUserId(user: UserIdResolvable): string {
	if (typeof user === 'string') {
		return user;
	}
	if (typeof user === 'number') {
		return user.toString(10);
	}
	return user.id;
}

/**
 * Extracts the username from an argument that is possibly an object containing that name.
 *
 * @param user The username or object.
 */
export function extractUserName(user: UserNameResolvable): string {
	return typeof user === 'string' ? user : user.name;
}
