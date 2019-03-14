import { PrivateMessage } from 'ircv3/lib/Message/MessageTypes/Commands/';
import ChatUser from '../ChatUser';
import { parseEmotes } from '../Toolkit/ChatTools';

export interface MessageCheermote {
	name: string;
	amount: number;
	position: number;
}

class TwitchPrivateMessage extends PrivateMessage {
	get userInfo() {
		return new ChatUser(this._prefix!.nick, this._tags);
	}

	get channelId() {
		if (!this._tags) {
			return null;
		}
		return this._tags.get('room-id') || null;
	}

	get isCheer() {
		if (!this._tags) {
			return false;
		}

		return this._tags.has('bits');
	}

	get totalBits() {
		if (!this._tags) {
			return 0;
		}

		return Number(this._tags.get('bits'));
	}

	get emoteOffsets() {
		if (!this._tags) {
			return new Map;
		}

		return parseEmotes(this._tags.get('emotes'));
	}
}

export default TwitchPrivateMessage;
