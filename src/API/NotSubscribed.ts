import CustomError from '../CustomError';

export default class NotSubscribed extends CustomError {
	constructor(channelId: string, userId: string) {
		super(`User ${userId} is not subscribed to channel ${channelId}`);
	}
}
