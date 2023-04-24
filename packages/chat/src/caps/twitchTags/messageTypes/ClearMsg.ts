import { Message, type MessageInternalConfig, type MessageInternalContents } from 'ircv3';

interface ClearMsgFields {
	channel: string;
	text: string;
}

export interface ClearMsg extends ClearMsgFields {}
export class ClearMsg extends Message<ClearMsgFields> {
	static readonly COMMAND = 'CLEARMSG';
	constructor(command: string, contents?: MessageInternalContents, config?: MessageInternalConfig) {
		super(command, contents, config, {
			channel: { type: 'channel' },
			text: { trailing: true }
		});
	}

	get date(): Date {
		const timestamp = this._tags.get('tmi-sent-ts')!;
		return new Date(Number(timestamp));
	}

	get userName(): string {
		return this._tags.get('login')!;
	}

	get channelId(): string {
		return this._tags.get('room-id')!;
	}

	get targetMessageId(): string {
		return this._tags.get('target-msg-id')!;
	}
}
