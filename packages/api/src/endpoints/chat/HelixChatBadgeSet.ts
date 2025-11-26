import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixChatBadgeSetData } from '../../interfaces/endpoints/chat.external.js';
import { HelixChatBadgeVersion } from './HelixChatBadgeVersion.js';

/**
 * A version of a chat badge.
 */
@Cacheable
@rtfm<HelixChatBadgeSet>('api', 'HelixChatBadgeSet', 'id')
export class HelixChatBadgeSet extends DataObject<HelixChatBadgeSetData> {
	/**
	 * The badge set ID.
	 */
	get id(): string {
		return this[rawDataSymbol].set_id;
	}

	/**
	 * All versions of the badge.
	 */
	@CachedGetter()
	get versions(): HelixChatBadgeVersion[] {
		return this[rawDataSymbol].versions.map(data => new HelixChatBadgeVersion(data));
	}

	/**
	 * Gets a specific version of the badge.
	 *
	 * @param versionId The ID of the version.
	 */
	getVersion(versionId: string): HelixChatBadgeVersion | null {
		return this.versions.find(v => v.id === versionId) ?? null;
	}
}
