import { ApiClient } from '../../../ApiClient';
import { HelixStreamMarker, HelixStreamMarkerData } from './HelixStreamMarker';

export interface HelixStreamMarkerVideoData extends HelixStreamMarkerData {
	URL: string;
}

export class HelixStreamMarkerWithVideo extends HelixStreamMarker {
	/** @private */
	constructor(data: HelixStreamMarkerVideoData, private readonly _videoId: string, client: ApiClient) {
		super(data, client);
	}

	/**
	 * The URL of the video, which will start playing at the position of the stream marker.
	 */
	get url() {
		return this._data.URL;
	}

	/**
	 * The ID of the video.
	 */
	get videoId() {
		return this._videoId;
	}

	/**
	 * Retrieves the video data of the video the marker was set in.
	 */
	async getVideo() {
		return this._client.helix.videos.getVideoById(this._videoId);
	}
}
