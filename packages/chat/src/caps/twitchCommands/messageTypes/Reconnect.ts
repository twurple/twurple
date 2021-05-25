import { Message } from 'ircv3';

/** @private */
export class Reconnect extends Message {
	static readonly COMMAND = 'RECONNECT';
}
