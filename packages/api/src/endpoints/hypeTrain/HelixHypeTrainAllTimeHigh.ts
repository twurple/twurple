import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixHypeTrainAllTimeHighData } from '../../interfaces/endpoints/hypeTrain.external';

/**
 * All-time-high Hype Train statistics.
 */
@rtfm('api', 'HelixHypeTrainAllTimeHigh')
export class HelixHypeTrainAllTimeHigh extends DataObject<HelixHypeTrainAllTimeHighData> {
	/**
	 * The level reached by the all-time-high Hype Train.
	 */
	get level(): number {
		return this[rawDataSymbol].level;
	}

	/**
	 * The total amount of contribution points reached by the all-time-high Hype Train.
	 */
	get total(): number {
		return this[rawDataSymbol].total;
	}

	/**
	 * The time when the all-time-high Hype Train was achieved.
	 */
	get achievementDate(): Date {
		return new Date(this[rawDataSymbol].achieved_at);
	}
}
