import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { HelixSnoozeNextAdData } from '../../interfaces/endpoints/channel.external.js';

/**
 * Represents the result after a call to snooze the broadcaster's ad schedule.
 */
@rtfm('api', 'HelixSnoozeNextAdResult')
export class HelixSnoozeNextAdResult extends DataObject<HelixSnoozeNextAdData> {
	/**
	 * The number of snoozes remaining for the broadcaster.
	 */
	get snoozeCount(): number {
		return this[rawDataSymbol].snooze_count;
	}

	/**
	 * The date and time when the broadcaster will gain an additional snooze.
	 */
	get snoozeRefreshDate(): Date {
		return new Date(this[rawDataSymbol].snooze_refresh_at * 1000);
	}

	/**
	 * The date and time of the broadcaster's next scheduled ad.
	 */
	get nextAdDate(): Date {
		return new Date(this[rawDataSymbol].next_ad_at * 1000);
	}
}
