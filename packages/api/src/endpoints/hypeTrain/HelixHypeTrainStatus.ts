import { Enumerable, mapNullable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient';
import { type HelixHypeTrainStatusData } from '../../interfaces/endpoints/hypeTrain.external';
import { HelixHypeTrain } from './HelixHypeTrain';
import { HelixHypeTrainAllTimeHigh } from './HelixHypeTrainAllTimeHigh';

/**
 * Statistics of Hype Trains on a channel.
 */
@rtfm('api', 'HelixHypeTrainStatus')
export class HelixHypeTrainStatus extends DataObject<HelixHypeTrainStatusData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixHypeTrainStatusData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The current Hype Train, or null if there is no ongoing Hype Train.
	 */
	get current(): HelixHypeTrain | null {
		return mapNullable(this[rawDataSymbol].current, data => new HelixHypeTrain(data, this._client));
	}

	/**
	 * The all-time-high Hype Train statistics for this channel, or null if there was no Hype Train yet.
	 */
	get allTimeHigh(): HelixHypeTrainAllTimeHigh | null {
		return mapNullable(this[rawDataSymbol].all_time_high, data => new HelixHypeTrainAllTimeHigh(data));
	}

	/**
	 * The all-time-high shared Hype Train statistics for this channel, or null if there was no shared Hype Train yet.
	 */
	get sharedAllTimeHigh(): HelixHypeTrainAllTimeHigh | null {
		return mapNullable(this[rawDataSymbol].shared_all_time_high, data => new HelixHypeTrainAllTimeHigh(data));
	}
}
