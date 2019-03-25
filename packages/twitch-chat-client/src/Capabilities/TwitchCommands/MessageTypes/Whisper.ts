import { Message, MessageParam, MessageParamSpec } from 'ircv3';
import ChatUser from '../../../ChatUser';
import { parseEmotes } from '../../../Toolkit/ChatTools';

/** @private */
export interface WhisperParams {
	target: MessageParam;
	message: MessageParam;
}

/** @private */
export default class Whisper extends Message<WhisperParams> {
	static readonly COMMAND = 'WHISPER';
	static readonly PARAM_SPEC: MessageParamSpec<Whisper> = {
		target: {},
		message: {
			trailing: true,
			optional: true
		}
	};

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
