import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type HelixEventSubConduitShardData,
	type HelixEventSubSubscriptionStatus,
} from '../../interfaces/endpoints/eventSub.external.js';

/**
 * Represents an EventSub conduit shard.
 */
@rtfm('api', 'HelixEventSubConduitShard')
export class HelixEventSubConduitShard extends DataObject<HelixEventSubConduitShardData> {
	/**
	 * The ID of the shard.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The status of the shard.
	 */
	get status(): HelixEventSubSubscriptionStatus {
		return this[rawDataSymbol].status;
	}

	/**
	 * The transport method of the shard.
	 */
	get transportMethod(): string {
		return this[rawDataSymbol].transport.method;
	}
}
