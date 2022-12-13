import { flatten } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type ChattersListData } from '../../interfaces/unsupported.external';

/**
 * A list of chatters in a Twitch chat.
 */
@rtfm('api', 'ChattersList')
export class ChattersList extends DataObject<ChattersListData> {
	/**
	 * A list of user names of all chatters in the chat.
	 */
	get allChatters(): string[] {
		return flatten(Object.values(this[rawDataSymbol].chatters));
	}

	/**
	 * A map of user names of all chatters in the chat, mapped to their status in the channel.
	 */
	get allChattersWithStatus(): Map<string, string> {
		return new Map(
			flatten(
				Object.entries(this[rawDataSymbol].chatters).map(([status, names]) =>
					names.map<[string, string]>(name => [name, status])
				)
			)
		);
	}
}
