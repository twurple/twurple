import { Message, MessageParam, MessageParamSpec } from 'ircv3';
import ChatUser from '../../../ChatUser';
import { parseEmotes } from '../../../Toolkit/ChatTools';

/** @private */
export interface UserNoticeParams {
	channel: MessageParam;
	message: MessageParam;
}

/** @private */
export default class UserNotice extends Message<UserNoticeParams> {
	static readonly COMMAND = 'USERNOTICE';
	static readonly PARAM_SPEC: MessageParamSpec<UserNotice> = {
		channel: {
			type: 'channel'
		},
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
			return new Map;
		}

		return parseEmotes(this._tags.get('emotes'));
	}
}
