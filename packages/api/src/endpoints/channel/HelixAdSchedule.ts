import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { HelixAdScheduleData } from '../../interfaces/endpoints/channel.external.js';

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
	 * The date and time when the broadcaster will gain an additional snooze.
	 * Returns `null` if all snoozes are already available.
	 */
	get snoozeRefreshDate(): Date | null {
		return this[rawDataSymbol].snooze_refresh_at ? new Date(this[rawDataSymbol].snooze_refresh_at * 1000) : null;
	}

	/**
	 * The date and time of the broadcaster's next scheduled ad.
	 * Returns `null` if channel is not live or has no ad scheduled.
	 */
	get nextAdDate(): Date | null {
		return this[rawDataSymbol].next_ad_at ? new Date(this[rawDataSymbol].next_ad_at * 1000) : null;
	}

	/**
	 * The length in seconds of the scheduled upcoming ad break.
	 */
	get duration(): number {
		return this[rawDataSymbol].duration;
	}

	/**
	 * The date and time of the broadcaster's last ad-break.
	 * Returns `null` if channel is not live or has not run an ad.
	 */
	get lastAdDate(): Date | null {
		return this[rawDataSymbol].last_ad_at ? new Date(this[rawDataSymbol].last_ad_at * 1000) : null;
	}

	/**
	 * The amount of pre-roll free time remaining for the channel in seconds.
	 */
	get prerollFreeTime(): number {
		return this[rawDataSymbol].preroll_free_time;
	}
}
