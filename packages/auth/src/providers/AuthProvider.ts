import { type UserIdResolvable } from '@twurple/common';
import type { AccessToken, AccessTokenMaybeWithUserId, AccessTokenWithUserId } from '../AccessToken';

/**
 * Describes a class that manages and supplies access tokens.
 *
 * Ideally, it should be able to request a new access token via user input
 * when previously unauthorized scopes are requested.
 *
 * As a starting point, {@link StaticAuthProvider} takes an access token,
 * but can't do anything to upgrade it by itself. {@link RefreshingAuthProvider}
 * can make use of refresh tokens to refresh your tokens on expiry or failure.
 *
 * @neverExpand
 */
export interface AuthProvider {
	/**
	 * The client ID.
	 */
	readonly clientId: string;

	/**
	 * The type of Authorization header to send. Defaults to "Bearer".
	 */
	readonly authorizationType?: string;

	/**
	 * Gets the scopes that are currently available using the access token for a user.
	 */
	getCurrentScopesForUser: (user: UserIdResolvable) => string[];

	/**
	 * Fetches a token for the given user.
	 *
	 * This should automatically request a new token when the current token
	 * is not authorized to use the requested scope(s).
	 *
	 * When implementing this, you should not do anything major when no
	 * scopes are requested - the cached token should be valid for that -
	 * unless you know exactly what you're doing.
	 *
	 * @param scopes The requested scope(s).
	 */
	getAccessTokenForUser: (user: UserIdResolvable, scopes?: string[]) => Promise<AccessTokenWithUserId>;

	/**
	 * Fetches a token for a user identified by the given intent defined by the provider.
	 *
	 * An intent is an arbitrary string that denotes a responsibility of a user's access token.
	 * For example, having the "chat" intent means that the token will be used to connect to chat by default.
	 *
	 * Intents are uniquely given to a single user, i.e. one intent can only be set to one user,
	 * but one user can be used for multiple intents.
	 *
	 * This is optional to implement, but required if you want to use the `ChatClient`,
	 * as it accesses its connection credentials using an intent.
	 *
	 * @param intent The intent to fetch a token for.
	 * @param scopes The requested scopes.
	 */
	getAccessTokenForIntent?: (intent: string, scopes?: string[]) => Promise<AccessTokenWithUserId>;

	/**
	 * Fetches an app token.
	 *
	 * Optional, for cases where you can't get a client secret in any way.
	 *
	 * @param forceNew Whether to always get a new token, even if the old one is still deemed valid internally.
	 */
	getAppAccessToken?: (forceNew?: boolean) => Promise<AccessToken>;

	/**
	 * Fetches any token to use with a request that supports both user and app tokens,
	 * i.e. public data relating to a user.
	 *
	 * Useful for resources that are public, but where you app needs to access the data
	 * in the context of the different users in order to not reach the rate limits for your app token.
	 *
	 * If there is no user, this should probably return an app token,
	 * but it can also return a user token in case you don't have access to app tokens.
	 *
	 * @param user The user.
	 */
	getAnyAccessToken: (user?: UserIdResolvable) => Promise<AccessTokenMaybeWithUserId>;

	/**
	 * Requests that the provider fetches a new token from Twitch for the given user.
	 *
	 * This method is optional to implement. For some use cases,
	 * it might not be desirable to e.g. ask the user to log in
	 * again at just any time.
	 */
	refreshAccessTokenForUser?: (user: UserIdResolvable) => Promise<AccessTokenWithUserId>;

	/**
	 * Requests that the provider fetches a new token from Twitch for the given intent.
	 *
	 * This method is optional to implement. For some use cases,
	 * it might not be desirable to e.g. ask the user to log in
	 * again at just any time, or you don't want to support intents.
	 */
	refreshAccessTokenForIntent?: (intent: string) => Promise<AccessTokenWithUserId>;
}
