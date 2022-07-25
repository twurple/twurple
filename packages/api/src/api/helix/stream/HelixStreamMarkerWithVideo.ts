import { rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixVideo } from '../video/HelixVideo';
import type { HelixStreamMarkerData } from './HelixStreamMarker';
import { HelixStreamMarker } from './HelixStreamMarker';

/** @private */
export interface HelixStreamMarkerVideoData extends HelixStreamMarkerData {
	URL: string;
}

/**
 * A stream marker, also containing some video data.
 *
 * @inheritDoc
 */
@rtfm<HelixStreamMarkerWithVideo>('api', 'HelixStreamMarkerWithVideo', 'id')
export class HelixStreamMarkerWithVideo extends HelixStreamMarker {
	/** @private */ declare readonly [rawDataSymbol]: HelixStreamMarkerVideoData;

	/** @private */
	constructor(data: HelixStreamMarkerVideoData, private readonly _videoId: string, client: ApiClient) {
		super(data, client);
	}

	/**
	 * The URL of the video, which will start playing at the position of the stream marker.
	 */
	get url(): string {
		return this[rawDataSymbol].URL;
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
	async getVideo(): Promise<HelixVideo> {
		return (await this._client.videos.getVideoById(this._videoId))!;
	}
}
