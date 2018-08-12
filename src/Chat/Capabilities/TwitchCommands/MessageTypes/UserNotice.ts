import { Message, MessageParam, MessageParamSpec } from 'ircv3';
import ChatUser from '../../../ChatUser';
import ChatClient from '../../../ChatClient';
import ChatTools from '../../../../Toolkit/ChatTools';

/** @private */
export interface UserNoticeParams {
	channel: MessageParam;
	message: MessageParam;
}

/** @private */
export default class UserNotice extends Message<UserNoticeParams> {
	public static readonly COMMAND = 'USERNOTICE';
	public static readonly PARAM_SPEC: MessageParamSpec<UserNoticeParams> = {
		channel: {
			type: 'channel'
		},
		message: {
			trailing: true,
			optional: true
		}
	};

	get userInfo(): ChatUser {
		return new ChatUser(this._prefix!, this._tags, this._client as ChatClient);
	}

	get emoteOffsets(): Map<string, string[]> {
		if (!this._tags) {
			return new Map;
		}

		return ChatTools.parseEmotes(this._tags.get('emotes'));
	}
}
