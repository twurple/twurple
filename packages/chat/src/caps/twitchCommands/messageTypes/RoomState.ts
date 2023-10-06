import { Message, type MessageInternalConfig, type MessageInternalContents } from 'ircv3';

interface RoomStateFields {
	channel: string;
}

export interface RoomState extends RoomStateFields {}
export class RoomState extends Message<RoomStateFields> {
	static readonly COMMAND = 'ROOMSTATE';
	constructor(command: string, contents?: MessageInternalContents, config?: MessageInternalConfig) {
		super(command, contents, config, {
			channel: { type: 'channel' },
		});
	}
}
