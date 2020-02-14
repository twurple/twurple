import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from '../../TwitchClient';
import ChatBadgeVersion, { ChatBadgeVersionData } from './ChatBadgeVersion';

/** @private */
export interface ChatBadgeSetData {
	versions: Record<string, ChatBadgeVersionData>;
}

/**
 * A set of badges.
 */
export default class ChatBadgeSet {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: ChatBadgeSetData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * Names of all versions of the badge set.
	 */
	get versionNames() {
		return Object.keys(this._data.versions);
	}

	/**
	 * Gets a specific version of a badge by name.
	 *
	 * @param name The name of the version.
	 */
	getVersion(name: string) {
		return new ChatBadgeVersion(this._data.versions[name], this._client);
	}
}
