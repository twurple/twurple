import { Message } from 'ircv3';

/** @private */
export default class Reconnect extends Message {
	static readonly COMMAND = 'RECONNECT';
}
