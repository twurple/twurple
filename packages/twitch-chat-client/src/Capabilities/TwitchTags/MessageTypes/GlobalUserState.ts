import { Message } from 'ircv3';

/**
 * This command has no parameters, all information is in tags.
 *
 * @private
 */
export default class GlobalUserState extends Message {
	static readonly COMMAND = 'GLOBALUSERSTATE';
}
