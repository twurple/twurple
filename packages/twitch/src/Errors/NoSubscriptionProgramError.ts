import { CustomError } from 'twitch-common';

/**
 * Thrown whenever you try accessing a subscription-related resource
 * (for example {@ChannelApi#getChannelSubscriptions})
 * and the given channel does not have a subscription program.
 */
export class NoSubscriptionProgramError extends CustomError {
	/** @private */
	constructor(channelId: string) {
		super(`Channel ${channelId} does not have a subscription program`);
	}
}
