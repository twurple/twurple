import { Message } from 'ircv3';

/**
 * This command has no parameters, all information is in tags.
 *
 * @private
 */
export default class GlobalUserState extends Message {
	public static readonly COMMAND = 'GLOBALUSERSTATE';
}
