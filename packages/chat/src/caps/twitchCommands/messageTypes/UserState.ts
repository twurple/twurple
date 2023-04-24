import { Message, type MessageInternalConfig, type MessageInternalContents } from 'ircv3';

interface UserStateFields {
	channel: string;
}

/** @private */
export class UserState extends Message<UserStateFields> {
	static readonly COMMAND = 'USERSTATE';

	constructor(command: string, contents?: MessageInternalContents, config?: MessageInternalConfig) {
		super(command, contents, config, {
			channel: { type: 'channel' }
		});
	}
}
