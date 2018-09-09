import CustomError from './CustomError';

/**
 * Thrown whenever you try calling a resource you#re not authorized to call.
 */
export default class AuthorizationError extends CustomError {
	constructor(message: string) {
		super(message);
	}
}
