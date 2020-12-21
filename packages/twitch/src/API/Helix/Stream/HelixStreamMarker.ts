import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ApiClient } from '../../../ApiClient';

export interface HelixStreamMarkerData {
	id: string;
	created_at: string;
	description: string;
	position_seconds: number;
	URL?: string;
}

/**
 * A stream marker.
 */
@rtfm<HelixStreamMarker>('twitch', 'HelixStreamMarker', 'id')
export class HelixStreamMarker {
	/** @private */ @Enumerable(false) protected readonly _data: HelixStreamMarkerData;
	/** @private */ @Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixStreamMarkerData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the marker.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The date and time when the marker was created.
	 */
	get creationDate(): Date {
		return new Date(this._data.created_at);
	}

	/**
	 * The description of the marker.
	 */
	get description(): string {
		return this._data.description;
	}

	/**
	 * The position in the stream when the marker was created, in seconds.
	 */
	get positionInSeconds(): number {
		return this._data.position_seconds;
	}
}
