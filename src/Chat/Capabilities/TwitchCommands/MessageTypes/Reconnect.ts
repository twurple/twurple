import { Message } from 'ircv3';

export default class Reconnect extends Message {
	public static readonly COMMAND = 'RECONNECT';
}
