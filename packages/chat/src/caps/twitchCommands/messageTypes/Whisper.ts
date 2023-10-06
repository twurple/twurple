import { Message, type MessageInternalConfig, type MessageInternalContents } from 'ircv3';
import { ChatUser } from '../../../ChatUser';
import { parseEmoteOffsets } from '../../../utils/emoteUtil';

interface WhisperFields {
	target: string;
	text: string;
}

/** @private */
export interface Whisper extends WhisperFields {}
/** @private */
export class Whisper extends Message<WhisperFields> {
	static readonly COMMAND = 'WHISPER';

	constructor(command: string, contents?: MessageInternalContents, config?: MessageInternalConfig) {
		super(command, contents, config, {
			target: {},
			text: { trailing: true },
		});
	}

	get userInfo(): ChatUser {
		return new ChatUser(this._prefix!.nick, this._tags);
	}

	get emoteOffsets(): Map<string, string[]> {
		return parseEmoteOffsets(this._tags.get('emotes'));
	}
}
