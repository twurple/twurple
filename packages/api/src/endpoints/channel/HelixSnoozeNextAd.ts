// import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
// import type { BaseApiClient } from '../../client/BaseApiClient';
import type { HelixSnoozeNextAdData } from '../../interfaces/endpoints/channel.external';
// import type { HelixUser } from '../user/HelixUser';

/**
 * Represents a broadcaster's ad schedule snooze event.
 */
@rtfm('api', 'HelixSnoozeNextAd')
export class HelixSnoozeNextAd extends DataObject<HelixSnoozeNextAdData> {
	/**
	 * The number of snoozes remaining for the broadcaster.
	 */
	get snoozeCount(): number {
		return this[rawDataSymbol].snooze_count;
	}

	/**
	 * The UTC Unix Epoch timestamp when the broadcaster will gain an additional snooze.
	 */
	get snoozeRefreshAt(): number {
		return this[rawDataSymbol].snooze_refresh_at;
	}

	/**
	 * The UTC Unix Epoch timestamp of the broadcaster's next scheduled ad.
	 */
	get nextAdAt(): number {
		return this[rawDataSymbol].next_ad_at;
	}
}
