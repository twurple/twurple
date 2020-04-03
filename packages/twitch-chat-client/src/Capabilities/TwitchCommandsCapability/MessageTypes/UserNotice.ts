import { Message, MessageParam, MessageParamDefinition, MessageType } from 'ircv3';
import ChatUser from '../../../ChatUser';
import {
	fillTextPositions,
	ParsedMessagePart,
	parseEmoteOffsets,
	parseEmotePositions
} from '../../../Toolkit/EmoteTools';

@MessageType('USERNOTICE')
export default class UserNotice extends Message<UserNotice> {
	@MessageParamDefinition({
		type: 'channel'
	})
	channel!: MessageParam;

	@MessageParamDefinition({
		trailing: true,
		optional: true
	})
	message!: MessageParam;

	get userInfo() {
		return new ChatUser(this._tags.get('login')!, this._tags);
	}

	get channelId() {
		return this._tags.get('room-id') || null;
	}

	get emoteOffsets() {
		return parseEmoteOffsets(this._tags?.get('emotes'));
	}

	parseEmotes() {
		const messageText = this.params.message;

		if (!messageText) {
			return [];
		}

		const foundEmotes: ParsedMessagePart[] = parseEmotePositions(messageText, this.emoteOffsets);

		return fillTextPositions(messageText, foundEmotes);
	}
}
