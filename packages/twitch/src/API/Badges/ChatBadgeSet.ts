import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '../../ApiClient';
import type { ChatBadgeVersionData } from './ChatBadgeVersion';
import { ChatBadgeVersion } from './ChatBadgeVersion';

/** @private */
export interface ChatBadgeSetData {
	versions: Record<string, ChatBadgeVersionData>;
}

/**
 * A set of badges.
 */
export class ChatBadgeSet {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: ChatBadgeSetData, client: ApiClient) {
		this._client = client;
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
		return new ChatBadgeVersion(this._data.versions[name], this._client);
	}
}
