/// <reference lib="es2017.object" />

import { Enumerable, flatten } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';

/** @private */
export interface ChattersListData {
	chatter_count: number;
	chatters: Record<string, string[]>;
}

/**
 * A list of chatters in a Twitch chat.
 */
@rtfm('twitch', 'ChattersList')
export class ChattersList {
	@Enumerable(false) private readonly _data: ChattersListData;

	/** @private */
	constructor(data: ChattersListData) {
		this._data = data;
	}

	/**
	 * A list of user names of all chatters in the chat.
	 */
	get allChatters(): string[] {
		return flatten(Object.values(this._data.chatters));
	}

	/**
	 * A map of user names of all chatters in the chat, mapped to their status in the channel.
	 */
	get allChattersWithStatus(): Map<string, string> {
		return new Map(
			flatten(
				Object.entries(this._data.chatters).map(([status, names]) =>
					names.map<[string, string]>(name => [name, status])
				)
			)
		);
	}
}
