import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ChatBadgeVersionData } from './ChatBadgeVersion';
import { ChatBadgeVersion } from './ChatBadgeVersion';

/** @private */
export interface ChatBadgeSetData {
	versions: Record<string, ChatBadgeVersionData>;
}

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
