import CustomError from '../CustomError';

/**
 * Thrown whenever you try accessing a specific follow of a user to a channel
 * (for example {@UserAPI#getFollowedChannel})
 * and the given user is not following the given channel.
 */
export default class NotFollowing extends CustomError {
	constructor(channelId: string, userId: string) {
		super(`User ${userId} does not follow channel ${channelId}`);
	}
}
