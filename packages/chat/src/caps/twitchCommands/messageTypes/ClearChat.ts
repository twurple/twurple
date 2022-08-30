import type { MessageParam } from 'ircv3';
import { Message, MessageParamDefinition, MessageType } from 'ircv3';

@MessageType('CLEARCHAT')
export class ClearChat extends Message<ClearChat> {
	@MessageParamDefinition({
		type: 'channel'
	})
	channel!: MessageParam;

	@MessageParamDefinition({
		trailing: true,
		optional: true
	})
	user!: MessageParam;

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
