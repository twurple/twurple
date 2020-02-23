import { PrivateMessage } from 'ircv3/lib/Message/MessageTypes/Commands/';
import { CheermoteList } from 'twitch';
import ChatUser from '../ChatUser';
import {
	fillTextPositions,
	ParsedMessageCheerPart,
	ParsedMessagePart,
	parseEmoteOffsets,
	parseEmotePositions
} from '../Toolkit/EmoteTools';

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
		return parseEmoteOffsets(this._tags?.get('emotes'));
	}

	parseEmotes() {
		const messageText = this.params.message;
		const foundEmotes: ParsedMessagePart[] = parseEmotePositions(messageText, this.emoteOffsets);

		return fillTextPositions(messageText, foundEmotes);
	}

	parseEmotesAndBits(cheermotes: CheermoteList): ParsedMessagePart[] {
		const messageText = this.params.message;
		const foundCheermotes = cheermotes.parseMessage(messageText);
		const foundEmotesAndCheermotes: ParsedMessagePart[] = [
			...parseEmotePositions(messageText, this.emoteOffsets),
			...foundCheermotes.map(
				(cheermote): ParsedMessageCheerPart => ({
					type: 'cheer',
					position: cheermote.position,
					length: cheermote.length,
					name: cheermote.name,
					amount: cheermote.amount,
					displayInfo: cheermote.displayInfo
				})
			)
		];

		foundEmotesAndCheermotes.sort((a, b) => a.position - b.position);

		return fillTextPositions(messageText, foundEmotesAndCheermotes);
	}
}

export default TwitchPrivateMessage;
