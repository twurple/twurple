import { Message } from 'ircv3';

/** @private */
export default class Reconnect extends Message {
	public static readonly COMMAND = 'RECONNECT';
}
