import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import { NonEnumerable } from '@d-fischer/shared-utils';
import HellFreezesOverError from '../../../Errors/HellFreezesOverError';
import TwitchClient from '../../../TwitchClient';

export type HelixVideoViewableStatus = 'public' | 'private';
export type HelixVideoType = 'upload' | 'archive' | 'highlight';

/** @private */
export interface HelixVideoData {
	id: string;
	user_id: string;
	user_name: string;
	title: string;
	description: string;
	created_at: string;
	published_at: string;
	url: string;
	thumbnail_url: string;
	viewable: HelixVideoViewableStatus;
	view_count: number;
	language: string;
	type: HelixVideoType;
	duration: string;
}

/**
 * A video on Twitch.
 */
@Cacheable
export default class HelixVideo {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: HelixVideoData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The ID of the video.
	 */
	get id() {
		return this._data.id;
	}

	/**
	 * The ID of the user who created the video.
	 */
	get userId() {
		return this._data.user_id;
	}

	/**
	 * The display name of the user who created the video.
	 */
	get userDisplayName() {
		return this._data.user_name;
	}

	/**
	 * Retrieves information about the user who created the video.
	 */
	async getUser() {
		return this._client.helix.users.getUserById(this._data.user_id);
	}

	/**
	 * The title of the video.
	 */
	get title() {
		return this._data.title;
	}

	/**
	 * The description of the video.
	 */
	get description() {
		return this._data.description;
	}

	/**
	 * The date when the video was created.
	 */
	get creationDate() {
		return new Date(this._data.created_at);
	}

	/**
	 * The date when the video was published.
	 */
	get publishDate() {
		return new Date(this._data.published_at);
	}

	/**
	 * The URL of the video.
	 */
	get url() {
		return this._data.url;
	}

	/**
	 * The URL of the thumbnail of the video.
	 */
	get thumbnailUrl() {
		return this._data.thumbnail_url;
	}

	/**
	 * Whether the video is public or not.
	 */
	get isPublic() {
		return this._data.viewable === 'public';
	}

	/**
	 * The number of views of the video.
	 */
	get views() {
		return this._data.view_count;
	}

	/**
	 * The language of the video.
	 */
	get language() {
		return this._data.language;
	}

	/**
	 * The type of the video.
	 */
	get type() {
		return this._data.type;
	}

	/**
	 * The duration of the video, as formatted by Twitch.
	 */
	get duration() {
		return this._data.duration;
	}

	/**
	 * The duration of the video, in seconds.
	 */
	@CachedGetter()
	get durationInSeconds() {
		const parts = this._data.duration.match(/\d+[hms]/g);
		if (!parts) {
			throw new HellFreezesOverError(`Could not parse duration string: ${this._data.duration}`);
		}
		return parts
			.map(part => {
				const partialMatch = part.match(/(\d+)([hms])/);
				if (!partialMatch) {
					throw new HellFreezesOverError(`Could not parse partial duration string: ${part}`);
				}

				const [, num, unit] = partialMatch;
				return parseInt(num, 10) * { h: 3600, m: 60, s: 1 }[unit];
			})
			.reduce((a, b) => a + b);
	}
}
