import { CustomError } from '@twurple/common';

/**
 * Not thrown anywhere anymore - this is a legacy error class.
 *
 * @deprecated
 */
export class NoSubscriptionProgramError extends CustomError {
	/** @private */
	constructor(channelId: string) {
		super(`Channel ${channelId} does not have a subscription program`);
	}
}
