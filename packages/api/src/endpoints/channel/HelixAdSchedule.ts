// import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
// import type { BaseApiClient } from '../../client/BaseApiClient';
import type { HelixAdScheduleData } from '../../interfaces/endpoints/channel.external';
// import type { HelixUser } from '../user/HelixUser';

/**
 * Represents a broadcaster's ad schedule.
 */
@rtfm('api', 'HelixAdSchedule')
export class HelixAdSchedule extends DataObject<HelixAdScheduleData> {
	/**
	 * The number of snoozes available for the broadcaster.
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

	/**
	 * The length in seconds of the scheduled upcoming ad break.
	 */
	get duration(): number {
		return this[rawDataSymbol].duration;
	}

	/**
	 * The UTC Unix Epoch timestamp of the broadcaster's last ad-break.
	 */
	get lastAdAt(): number {
		return this[rawDataSymbol].last_ad_at;
	}

	/**
	 * The amount of pre-roll free time remaining for the channel in seconds.
	 */
	get prerollFreeTime(): number {
		return this[rawDataSymbol].preroll_free_time;
	}
}
