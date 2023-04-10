import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient';
import { type HelixStreamMarkerData } from '../../interfaces/endpoints/stream.external';

/**
 * A stream marker.
 */
@rtfm<HelixStreamMarker>('api', 'HelixStreamMarker', 'id')
export class HelixStreamMarker extends DataObject<HelixStreamMarkerData> {
	/** @private */ @Enumerable(false) protected readonly _client: BaseApiClient;

	/** @private */
	constructor(data: HelixStreamMarkerData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the marker.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The date and time when the marker was created.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * The description of the marker.
	 */
	get description(): string {
		return this[rawDataSymbol].description;
	}

	/**
	 * The position in the stream when the marker was created, in seconds.
	 */
	get positionInSeconds(): number {
		return this[rawDataSymbol].position_seconds;
	}
}
