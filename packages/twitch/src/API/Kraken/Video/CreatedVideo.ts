import { ApiClient } from '../../../ApiClient';
import { Video, VideoData } from './Video';

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
	private _uploadData: CreatedVideoUploadData;

	/** @private */
	constructor(data: CreatedVideoData, client: ApiClient) {
		super(data.video, client);
		this._uploadData = data.upload;
	}

	/**
	 * The upload token for your video. Use it to upload your video parts.
	 */
	get uploadToken() {
		return this._uploadData.token;
	}
}
