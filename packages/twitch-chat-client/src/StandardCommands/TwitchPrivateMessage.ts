import { PrivateMessage } from 'ircv3/lib/Message/MessageTypes/Commands/';
import { CheermoteDisplayInfo, CheermoteList } from 'twitch';
import ChatUser from '../ChatUser';
import { parseEmotes } from '../Toolkit/ChatTools';
import { utf8Length, utf8Substring } from '../Toolkit/StringTools';

export interface ParsedMessageTextPart {
	type: 'text';
	position: number;
	length: number;
	text: string;
}

export interface ParsedMessageCheerPart {
	type: 'cheer';
	position: number;
	length: number;
	name: string;
	amount: number;
	displayInfo: CheermoteDisplayInfo;
}

export interface ParsedMessageEmotePart {
	type: 'emote';
	position: number;
	length: number;
	id: string;
	name: string;
}

export type ParsedMessagePart = ParsedMessageTextPart | ParsedMessageCheerPart | ParsedMessageEmotePart;

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
			return new Map<string, string[]>();
		}

		return parseEmotes(this._tags.get('emotes'));
	}

	parseEmotes() {
		const foundEmotes: ParsedMessagePart[] = this._parseEmotePositions();

		return this._fillTextPositions(this.params.message, foundEmotes);
	}

	parseEmotesAndBits(cheermotes: CheermoteList): ParsedMessagePart[] {
		const foundCheermotes = cheermotes.parseMessage(this.params.message);
		const foundEmotesAndCheermotes: ParsedMessagePart[] = [
			...this._parseEmotePositions(),
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

		return foundEmotesAndCheermotes;
	}

	private _parseEmotePositions() {
		return [...this.emoteOffsets.entries()]
			.flatMap(([emote, placements]) =>
				placements.map(
					(placement): ParsedMessageEmotePart => {
						const [startStr, endStr] = placement.split('-');
						const start = +startStr;
						const end = +endStr;

						return {
							type: 'emote',
							position: start,
							length: end - start + 1,
							id: emote,
							name: utf8Substring(this.params.message, start, end + 1)
						};
					}
				)
			)
			.sort((a, b) => a.position - b.position);
	}

	private _fillTextPositions(message: string, otherPositions: ParsedMessagePart[]): ParsedMessagePart[] {
		const messageLength = utf8Length(message);
		if (!otherPositions.length) {
			return [
				{
					type: 'text',
					position: 0,
					length: messageLength,
					text: message
				}
			];
		}

		const result: ParsedMessagePart[] = [];
		let currentPosition = 0;

		for (const token of otherPositions) {
			if (token.position > currentPosition) {
				result.push({
					type: 'text',
					position: currentPosition,
					length: token.position - currentPosition,
					text: utf8Substring(message, currentPosition, token.position)
				});
			}
			result.push(token);
			currentPosition = token.position + token.length;
		}

		if (currentPosition < messageLength) {
			result.push({
				type: 'text',
				position: currentPosition,
				length: messageLength - currentPosition,
				text: utf8Substring(message, currentPosition)
			});
		}

		return result;
	}
}

export default TwitchPrivateMessage;
