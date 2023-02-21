import { type TwitchApiCallOptions } from '@twurple/api-call';

/**
 * The definition of an API call intended to be called in the context of a specific user ID or of the app.
 *
 * @inheritDoc
 */
export interface ContextApiCallOptions extends TwitchApiCallOptions {
	/**
	 * Require the call to be sent using an user/app access token.
	 */
	forceType?: 'user' | 'app';

	/**
	 * The ID of the user to use as the context of the API call.
	 */
	userId?: string;

	/**
	 * Whether user context can be overridden using `asUser` or `asIntent` even though scopes are set.
	 */
	canOverrideScopedUserContext?: boolean;
}
