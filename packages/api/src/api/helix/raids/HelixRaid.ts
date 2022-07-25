import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export interface HelixRaidData {
	created_at: string;
	is_mature: boolean;
}

/**
 * A result of a successful raid initiation.
 */
@rtfm('api', 'HelixRaid')
export class HelixRaid extends DataObject<HelixRaidData> {
	/**
	 * The date when the raid was initiated.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * Whether the raid target channel is intended for mature audiences.
	 */
	get targetIsMature(): boolean {
		return this[rawDataSymbol].is_mature;
	}
}
