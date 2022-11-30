import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type ChatBadgeSetData } from '../../interfaces/badges.external';
import { ChatBadgeVersion } from './ChatBadgeVersion';

/**
 * A set of badges.
 */
@rtfm('api', 'ChatBadgeSet')
export class ChatBadgeSet extends DataObject<ChatBadgeSetData> {
	/**
	 * Names of all versions of the badge set.
	 */
	get versionNames(): string[] {
		return Object.keys(this[rawDataSymbol].versions);
	}

	/**
	 * Gets a specific version of a badge by name.
	 *
	 * @param name The name of the version.
	 */
	getVersion(name: string): ChatBadgeVersion {
		return new ChatBadgeVersion(this[rawDataSymbol].versions[name]);
	}
}
