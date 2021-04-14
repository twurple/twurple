import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { ChatBadgeVersionData } from './ChatBadgeVersion';
import { ChatBadgeVersion } from './ChatBadgeVersion';

/** @private */
export interface ChatBadgeSetData {
	versions: Record<string, ChatBadgeVersionData>;
}

/**
 * A set of badges.
 */
@rtfm('twitch', 'ChatBadgeSet')
export class ChatBadgeSet {
	@Enumerable(false) private readonly _data: ChatBadgeSetData;

	/** @private */
	constructor(data: ChatBadgeSetData) {
		this._data = data;
	}

	/**
	 * Names of all versions of the badge set.
	 */
	get versionNames(): string[] {
		return Object.keys(this._data.versions);
	}

	/**
	 * Gets a specific version of a badge by name.
	 *
	 * @param name The name of the version.
	 */
	getVersion(name: string): ChatBadgeVersion {
		return new ChatBadgeVersion(this._data.versions[name]);
	}
}
