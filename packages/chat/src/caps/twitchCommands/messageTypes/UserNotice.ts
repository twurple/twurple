import { Message, type MessageInternalConfig, type MessageInternalContents } from 'ircv3';
import { ChatUser } from '../../../ChatUser';
import { parseEmoteOffsets } from '../../../utils/emoteUtil';

interface UserNoticeFields {
	channel: string;
	text?: string;
}

export interface UserNotice extends UserNoticeFields {}
export class UserNotice extends Message<UserNoticeFields> {
	static readonly COMMAND = 'USERNOTICE';
	constructor(command: string, contents?: MessageInternalContents, config?: MessageInternalConfig) {
		super(command, contents, config, {
			channel: { type: 'channel' },
			text: { trailing: true, optional: true }
		});
	}

	get id(): string {
		return this._tags.get('id')!;
	}

	get date(): Date {
		const timestamp = this._tags.get('tmi-sent-ts')!;
		return new Date(Number(timestamp));
	}

	get userInfo(): ChatUser {
		return new ChatUser(this._tags.get('login')!, this._tags);
	}

	get channelId(): string | null {
		return this._tags.get('room-id') ?? null;
	}

	get emoteOffsets(): Map<string, string[]> {
		return parseEmoteOffsets(this._tags.get('emotes'));
	}
}
