import CustomError from './CustomError';

export default class InvalidTokenError extends CustomError {
	constructor() {
		super('Invalid token supplied');
	}
}
