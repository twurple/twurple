import type { ParsedMessagePart } from '@twurple/common';
import { parseChatMessage } from '@twurple/common';
import type { MessageParam } from 'ircv3';
import { Message, MessageParamDefinition, MessageType } from 'ircv3';
import { ChatUser } from '../../../ChatUser';
import { parseEmoteOffsets } from '../../../utils/emoteUtil';
import { getMessageText } from '../../../utils/messageUtil';

/** @private */
@MessageType('WHISPER')
export class Whisper extends Message<Whisper> {
	@MessageParamDefinition()
	target!: MessageParam;

	@MessageParamDefinition({
		trailing: true,
		optional: true
	})
	message!: MessageParam;

	get userInfo(): ChatUser {
		return new ChatUser(this._prefix!.nick, this._tags);
	}

	get emoteOffsets(): Map<string, string[]> {
		return parseEmoteOffsets(this._tags.get('emotes'));
	}

	parseEmotes(): ParsedMessagePart[] {
		const messageText = getMessageText(this.params.message);

		return parseChatMessage(messageText, this.emoteOffsets) as ParsedMessagePart[];
	}
}
