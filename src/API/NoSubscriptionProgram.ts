import CustomError from '../CustomError';

export default class NoSubscriptionProgram extends CustomError {
	constructor(channelId: string) {
		super(`Channel ${channelId} does not have a subscription program`);
	}
}
