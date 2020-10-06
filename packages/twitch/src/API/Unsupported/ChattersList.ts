/// <reference lib="es2017.object" />

import { flatten } from '@d-fischer/shared-utils';

/** @private */
export interface ChattersListData {
	chatter_count: number;
	chatters: Record<string, string[]>;
}

/**
 * A list of chatters in a Twitch chat.
 */
export class ChattersList {
	/** @private */
	constructor(private readonly _data: ChattersListData) {}

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
