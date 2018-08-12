import CustomError from '../CustomError';

/**
 * Thrown whenever you try accessing a subscription-related resource
 * (for example {@link ChannelAPI.getChannelSubscriptions})
 * and the given channel does not have a subscription program.
 */
export default class NoSubscriptionProgram extends CustomError {
	constructor(channelId: string) {
		super(`Channel ${channelId} does not have a subscription program`);
	}
}
