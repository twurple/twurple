import { CachedGetter } from '@d-fischer/cache-decorators';
import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { HelixChatBadgeVersionData } from './HelixChatBadgeVersion';
import { HelixChatBadgeVersion } from './HelixChatBadgeVersion';

/** @private */
export interface HelixChatBadgeSetData {
	set_id: string;
	versions: HelixChatBadgeVersionData[];
}

/**
 * A version of a chat badge.
 */
@rtfm<HelixChatBadgeSet>('twitch', 'HelixChatBadgeSet', 'id')
export class HelixChatBadgeSet {
	@Enumerable(false) private readonly _data: HelixChatBadgeSetData;

	/** @private */
	constructor(data: HelixChatBadgeSetData) {
		this._data = data;
	}

	/**
	 * The badge set ID.
	 */
	get id(): string {
		return this._data.set_id;
	}

	/**
	 * All versions of the badge.
	 */
	@CachedGetter()
	get versions(): HelixChatBadgeVersion[] {
		return this._data.versions.map(data => new HelixChatBadgeVersion(data));
	}

	/**
	 * Retrieves a specific version of the badge.
	 *
	 * @param versionId The ID of the version.
	 */
	getVersion(versionId: string): HelixChatBadgeVersion | null {
		return this.versions.find(v => v.id === versionId) ?? null;
	}
}
