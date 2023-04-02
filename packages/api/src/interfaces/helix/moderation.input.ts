import { type UserIdResolvable } from '@twurple/common';
import { type HelixForwardPagination } from '../../api/helix/HelixPagination';
import { type HelixAutoModSettings } from '../../api/helix/moderation/HelixAutoModSettings';

/**
 * Filters for the banned users request.
 *
 * @inheritDoc
 */
export interface HelixBanFilter extends HelixForwardPagination {
	/**
	 * A user ID or a list thereof.
	 */
	userId?: string | string[];
}

/**
 * Filters for the moderators request.
 *
 * @inheritDoc
 */
export interface HelixModeratorFilter extends HelixForwardPagination {
	/**
	 * A user ID or a list thereof.
	 */
	userId?: string | string[];
}

export interface HelixCheckAutoModStatusData {
	/**
	 * The developer-generated ID for mapping messages to their status results.
	 */
	messageId: string;

	/**
	 * The text of the message the AutoMod status needs to be checked for.
	 */
	messageText: string;
}

export type HelixAutoModSettingsUpdate = Exclude<HelixAutoModSettings, 'broadcasterId' | 'moderatorId'>;

/**
 * Information about a user to be banned/timed out from a channel.
 */
export interface HelixBanUserRequest {
	/**
	 * The duration (in seconds) that the user should be timed out. If this value is null, the user will be banned.
	 */
	duration?: number;

	/**
	 * The reason why the user is being timed out/banned.
	 */
	reason: string;

	/**
	 * The user who is to be banned/timed out.
	 */
	user: UserIdResolvable;
}
