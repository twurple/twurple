import type { MessageParam } from 'ircv3';
import { Message, MessageParamDefinition, MessageType } from 'ircv3';
import { ChatUser } from '../../../ChatUser';
import { parseEmoteOffsets } from '../../../utils/emoteUtil';

@MessageType('USERNOTICE')
export class UserNotice extends Message<UserNotice> {
	@MessageParamDefinition({
		type: 'channel'
	})
	channel!: MessageParam;

	@MessageParamDefinition({
		trailing: true,
		optional: true
	})
	message!: MessageParam;

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
