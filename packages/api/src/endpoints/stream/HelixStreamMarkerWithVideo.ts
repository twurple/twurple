import { checkRelationAssertion, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient.js';
import { type HelixStreamMarkerVideoData } from '../../interfaces/endpoints/stream.external.js';
import type { HelixVideo } from '../video/HelixVideo.js';
import { HelixStreamMarker } from './HelixStreamMarker.js';

/**
 * A stream marker, also containing some video data.
 *
 * @inheritDoc
 */
@rtfm<HelixStreamMarkerWithVideo>('api', 'HelixStreamMarkerWithVideo', 'id')
export class HelixStreamMarkerWithVideo extends HelixStreamMarker {
	/** @internal */ declare readonly [rawDataSymbol]: HelixStreamMarkerVideoData;

	/** @internal */
	constructor(data: HelixStreamMarkerVideoData, private readonly _videoId: string, client: BaseApiClient) {
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
	 * Gets the video data of the video the marker was set in.
	 */
	async getVideo(): Promise<HelixVideo> {
		return checkRelationAssertion(await this._client.videos.getVideoById(this._videoId));
	}
}
