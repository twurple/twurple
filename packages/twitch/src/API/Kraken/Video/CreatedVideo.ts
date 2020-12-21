import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ApiClient } from '../../../ApiClient';
import type { VideoData } from './Video';
import { Video } from './Video';

/** @private */
export interface CreatedVideoUploadData {
	token: string;
	url: string;
}

/** @private */
export interface CreatedVideoData {
	upload: CreatedVideoUploadData;
	video: VideoData;
}

/**
 * A Twitch video that was just created.
 */
@rtfm<CreatedVideo>('twitch', 'CreatedVideo', 'id')
export class CreatedVideo extends Video {
	@Enumerable(false) private readonly _uploadData: CreatedVideoUploadData;

	/** @private */
	constructor(data: CreatedVideoData, client: ApiClient) {
		super(data.video, client);
		this._uploadData = data.upload;
	}

	/**
	 * The upload token for your video. Use it to upload your video parts.
	 */
	get uploadToken(): string {
		return this._uploadData.token;
	}
}
