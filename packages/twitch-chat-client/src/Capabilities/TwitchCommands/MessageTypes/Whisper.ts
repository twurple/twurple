import { Message, MessageParam, MessageParamDefinition, MessageType } from 'ircv3';
import ChatUser from '../../../ChatUser';
import { parseEmotes } from '../../../Toolkit/ChatTools';

/** @private */
@MessageType('WHISPER')
export default class Whisper extends Message<Whisper, 'userInfo' | 'emoteOffsets'> {
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
		if (!this._tags) {
			return new Map<string, string[]>();
		}

		return parseEmotes(this._tags.get('emotes'));
	}
}
