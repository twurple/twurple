import { Message } from 'ircv3';

// this command has no parameters, all information is in tags
export default class UserState extends Message {
	public static readonly COMMAND = 'USERSTATE';
}
