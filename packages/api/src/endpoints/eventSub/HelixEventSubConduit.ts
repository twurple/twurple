import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { HelixPaginatedResponse } from '@twurple/api-call';
import type { BaseApiClient } from '../../client/BaseApiClient';
import type { HelixEventSubConduitData } from '../../interfaces/endpoints/eventSub.external';
import type { HelixEventSubConduitShard } from './HelixEventSubConduitShard';

/**
 * Represents an EventSub conduit.
 */
@rtfm('api', 'HelixEventSubConduit')
export class HelixEventSubConduit extends DataObject<HelixEventSubConduitData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixEventSubConduitData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the conduit.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The shard count of the conduit.
	 */
	get shardCount(): number {
		return this[rawDataSymbol].shard_count;
	}

	/**
	 * Update the conduit.
	 *
	 * @param shardCount The new shard count.
	 */
	async update(shardCount: number): Promise<HelixEventSubConduit> {
		return await this._client.eventSub.updateConduit(this[rawDataSymbol].id, shardCount);
	}

	/**
	 * Delete the conduit.
	 */
	async delete(): Promise<void> {
		await this._client.eventSub.deleteConduit(this[rawDataSymbol].id);
	}

	/**
	 * Get the conduit shards.
	 */
	async getShards(): Promise<HelixPaginatedResponse<HelixEventSubConduitShard>> {
		return await this._client.eventSub.getConduitShards(this[rawDataSymbol].id);
	}
}
