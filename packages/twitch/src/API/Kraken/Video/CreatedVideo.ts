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
export class CreatedVideo extends Video {
	private readonly _uploadData: CreatedVideoUploadData;

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
