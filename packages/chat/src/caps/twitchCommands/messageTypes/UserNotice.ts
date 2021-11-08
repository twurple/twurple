import type { ParsedMessagePart } from '@twurple/common';
import { fillTextPositions } from '@twurple/common';
import type { MessageParam } from 'ircv3';
import { Message, MessageParamDefinition, MessageType } from 'ircv3';
import { ChatUser } from '../../../ChatUser';
import { parseEmoteOffsets, parseEmotePositions } from '../../../utils/emoteUtil';

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

	get userInfo(): ChatUser {
		return new ChatUser(this._tags.get('login')!, this._tags);
	}

	get channelId(): string | null {
		return this._tags.get('room-id') ?? null;
	}

	get emoteOffsets(): Map<string, string[]> {
		return parseEmoteOffsets(this._tags.get('emotes'));
	}

	parseEmotes(): ParsedMessagePart[] {
		const messageText = this.params.message;

		if (!messageText) {
			return [];
		}

		const foundEmotes: ParsedMessagePart[] = parseEmotePositions(messageText, this.emoteOffsets);

		return fillTextPositions(messageText, foundEmotes);
	}
}
