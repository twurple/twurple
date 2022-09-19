import { CustomError } from '@twurple/common';

/**
 * Thrown whenever you try accessing a subscription-related resource
 * such as {@link ChannelApi#getChannelSubscriptions}}
 * and the given channel does not have a subscription program.
 */
export class NoSubscriptionProgramError extends CustomError {
	/** @private */
	constructor(channelId: string) {
		super(`Channel ${channelId} does not have a subscription program`);
	}
}
