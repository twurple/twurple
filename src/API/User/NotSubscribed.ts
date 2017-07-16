import CustomError from '../../CustomError';

export default class NotFollowing extends CustomError {
	constructor(channelId: string, userId: string) {
		super(`User ${userId} does not follow channel ${channelId}`);
	}
}
