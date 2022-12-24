import { type UserIdResolvable } from '@twurple/common';
import { type HelixForwardPagination } from '../../api/helix/HelixPagination';

/**
 * User data to update using {@link HelixUserApi#updateAuthenticatedUser}}.
 */
export interface HelixUserUpdate {
	description?: string;
}

/**
 * Additional info for a block to be created.
 */
export interface HelixUserBlockAdditionalInfo {
	/**
	 * The source context for blocking the user.
	 */
	sourceContext?: 'chat' | 'whisper';

	/**
	 * The reason for blocking the user.
	 */
	reason?: 'spam' | 'harassment' | 'other';
}

/**
 * Filters for the follower request.
 */
export interface HelixFollowFilter {
	/**
	 * The following user.
	 */
	user?: UserIdResolvable;

	/**
	 * The followed user.
	 */
	followedUser?: UserIdResolvable;
}

/**
 * @inheritDoc
 */
export interface HelixPaginatedFollowFilter extends HelixFollowFilter, HelixForwardPagination {}
