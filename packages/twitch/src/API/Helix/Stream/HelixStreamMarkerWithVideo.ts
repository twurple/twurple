import type { ApiClient } from '../../../ApiClient';
import type { HelixVideo } from '../Video/HelixVideo';
import type { HelixStreamMarkerData } from './HelixStreamMarker';
import { HelixStreamMarker } from './HelixStreamMarker';

export interface HelixStreamMarkerVideoData extends HelixStreamMarkerData {
	URL: string;
}

export class HelixStreamMarkerWithVideo extends HelixStreamMarker {
	protected readonly _data: HelixStreamMarkerVideoData;

	/** @private */
	constructor(data: HelixStreamMarkerVideoData, private readonly _videoId: string, client: ApiClient) {
		super(data, client);
	}

	/**
	 * The URL of the video, which will start playing at the position of the stream marker.
	 */
	get url(): string {
		return this._data.URL;
	}

	/**
	 * The ID of the video.
	 */
	get videoId(): string {
		return this._videoId;
	}

	/**
	 * Retrieves the video data of the video the marker was set in.
	 */
	async getVideo(): Promise<HelixVideo | null> {
		return this._client.helix.videos.getVideoById(this._videoId);
	}
}
