import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixVideo } from '../Video/HelixVideo';
import type { HelixStreamMarkerData } from './HelixStreamMarker';
import { HelixStreamMarker } from './HelixStreamMarker';

/** @private */
export interface HelixStreamMarkerVideoData extends HelixStreamMarkerData {
	URL: string;
}

/**
 * A stream marker, also containing some video data.
 */
@rtfm<HelixStreamMarkerWithVideo>('api', 'HelixStreamMarkerWithVideo', 'id')
export class HelixStreamMarkerWithVideo extends HelixStreamMarker {
	/** @private */ protected declare readonly _data: HelixStreamMarkerVideoData;

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
		return await this._client.helix.videos.getVideoById(this._videoId);
	}
}
