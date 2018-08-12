import CustomError from '../CustomError';

/**
 * Thrown whenever you try accessing a specific subscription of a user to a channel
 * (for example {@UserAPI#getSubscriptionData})
 * and the given user is not subscribed to the given channel.
 */
export default class NotSubscribed extends CustomError {
	constructor(channelId: string, userId: string) {
		super(`User ${userId} is not subscribed to channel ${channelId}`);
	}
}
