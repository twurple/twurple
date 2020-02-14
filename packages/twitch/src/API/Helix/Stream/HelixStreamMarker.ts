import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from '../../../TwitchClient';

export interface HelixStreamMarkerData {
	id: string;
	created_at: string;
	description: string;
	position_seconds: number;
	URL?: string;
}

export default class HelixStreamMarker {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(/** @private */ protected readonly _data: HelixStreamMarkerData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The ID of the marker.
	 */
	get id() {
		return this._data.id;
	}

	/**
	 * The date and time when the marker was created.
	 */
	get creationDate() {
		return new Date(this._data.created_at);
	}

	/**
	 * The description of the marker.
	 */
	get description() {
		return this._data.description;
	}

	/**
	 * The position in the stream when the marker was created, in seconds.
	 */
	get positionInSeconds() {
		return this._data.position_seconds;
	}
}
