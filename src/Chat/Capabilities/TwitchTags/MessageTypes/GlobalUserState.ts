import { Message } from 'ircv3';

// this command has no parameters, all information is in tags
export default class GlobalUserState extends Message {
	public static readonly COMMAND = 'GLOBALUSERSTATE';
}
