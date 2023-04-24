import type { MessageInternalConfig, MessageInternalContents } from 'ircv3';
import { Message } from 'ircv3';

interface ClearChatFields {
	channel: string;
	user?: string;
}

export interface ClearChat extends ClearChatFields {}
export class ClearChat extends Message<ClearChatFields> {
	static readonly COMMAND = 'CLEARCHAT';
	constructor(command: string, contents?: MessageInternalContents, config?: MessageInternalConfig) {
		super(command, contents, config, {
			channel: { type: 'channel' },
			user: { trailing: true, optional: true }
		});
	}

	get date(): Date {
		const timestamp = this._tags.get('tmi-sent-ts')!;
		return new Date(Number(timestamp));
	}

	get channelId(): string {
		return this._tags.get('room-id')!;
	}

	get targetUserId(): string | null {
		return this._tags.get('target-user-id') ?? null;
	}
}
