import { PrivateMessage } from 'ircv3/lib/Message/MessageTypes/Commands/';
import ChatUser from '../ChatUser';
import ChatClient from '../ChatClient';
import ChatTools from '../../Toolkit/ChatTools';

class TwitchPrivateMessage extends PrivateMessage {
	get userInfo(): ChatUser {
		return new ChatUser(this._prefix!, this._tags, this._client as ChatClient);
	}

	get isCheer(): boolean {
		if (!this._tags) {
			return false;
		}

		return this._tags.has('bits');
	}

	get emoteOffsets(): Map<string, string[]> {
		if (!this._tags) {
			return new Map;
		}

		return ChatTools.parseEmotes(this._tags.get('emotes'));
	}
}

export default TwitchPrivateMessage;
