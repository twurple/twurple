import { Message, MessageParam, MessageParamDefinition, MessageType } from 'ircv3';
import ChatUser from '../../../ChatUser';
import {
	fillTextPositions,
	ParsedMessagePart,
	parseEmoteOffsets,
	parseEmotePositions
} from '../../../Toolkit/EmoteTools';

/** @private */
@MessageType('WHISPER')
export default class Whisper extends Message<Whisper> {
	@MessageParamDefinition()
	target!: MessageParam;

	@MessageParamDefinition({
		trailing: true,
		optional: true
	})
	message!: MessageParam;

	get userInfo() {
		return new ChatUser(this._prefix!.nick, this._tags);
	}

	get emoteOffsets() {
		return parseEmoteOffsets(this._tags?.get('emotes'));
	}

	parseEmotes() {
		const messageText = this.params.message;
		const foundEmotes: ParsedMessagePart[] = parseEmotePositions(messageText, this.emoteOffsets);

		return fillTextPositions(messageText, foundEmotes);
	}
}
