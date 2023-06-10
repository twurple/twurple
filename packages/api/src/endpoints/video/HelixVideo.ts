import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, HellFreezesOverError, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient';
import {
	type HelixVideoData,
	type HelixVideoMutedSegmentData,
	type HelixVideoType
} from '../../interfaces/endpoints/video.external';
import type { HelixUser } from '../user/HelixUser';

/**
 * A video on Twitch.
 */
@Cacheable
@rtfm<HelixVideo>('api', 'HelixVideo', 'id')
export class HelixVideo extends DataObject<HelixVideoData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixVideoData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the video.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The ID of the user who created the video.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user who created the video.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user who created the video.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets information about the user who created the video.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The title of the video.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The description of the video.
	 */
	get description(): string {
		return this[rawDataSymbol].description;
	}

	/**
	 * The date when the video was created.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * The date when the video was published.
	 */
	get publishDate(): Date {
		return new Date(this[rawDataSymbol].published_at);
	}

	/**
	 * The URL of the video.
	 */
	get url(): string {
		return this[rawDataSymbol].url;
	}

	/**
	 * The URL of the thumbnail of the video.
	 */
	get thumbnailUrl(): string {
		return this[rawDataSymbol].thumbnail_url;
	}

	/**
	 * Builds the thumbnail URL of the video using the given dimensions.
	 *
	 * @param width The width of the thumbnail.
	 * @param height The height of the thumbnail.
	 */
	getThumbnailUrl(width: number, height: number): string {
		return this[rawDataSymbol].thumbnail_url
			.replace('%{width}', width.toString())
			.replace('%{height}', height.toString());
	}

	/**
	 * Whether the video is public or not.
	 */
	get isPublic(): boolean {
		return this[rawDataSymbol].viewable === 'public';
	}

	/**
	 * The number of views of the video.
	 */
	get views(): number {
		return this[rawDataSymbol].view_count;
	}

	/**
	 * The language of the video.
	 */
	get language(): string {
		return this[rawDataSymbol].language;
	}

	/**
	 * The type of the video.
	 */
	get type(): HelixVideoType {
		return this[rawDataSymbol].type;
	}

	/**
	 * The duration of the video, as formatted by Twitch.
	 */
	get duration(): string {
		return this[rawDataSymbol].duration;
	}

	/**
	 * The duration of the video, in seconds.
	 */
	@CachedGetter()
	get durationInSeconds(): number {
		const parts = this[rawDataSymbol].duration.match(/\d+[hms]/g);
		if (!parts) {
			throw new HellFreezesOverError(`Could not parse duration string: ${this[rawDataSymbol].duration}`);
		}
		return parts
			.map(part => {
				const partialMatch = /(\d+)([hms])/.exec(part);
				if (!partialMatch) {
					throw new HellFreezesOverError(`Could not parse partial duration string: ${part}`);
				}

				const [, num, unit] = partialMatch;
				return parseInt(num, 10) * { h: 3600, m: 60, s: 1 }[unit as 'h' | 'm' | 's'];
			})
			.reduce((a, b) => a + b);
	}

	/**
	 * The ID of the stream this video belongs to.
	 *
	 * Returns null if the video is not an archived stream.
	 */
	get streamId(): string | null {
		return this[rawDataSymbol].stream_id;
	}

	/**
	 * The raw data of muted segments of the video.
	 */
	get mutedSegmentData(): HelixVideoMutedSegmentData[] {
		return this[rawDataSymbol].muted_segments?.slice() ?? [];
	}

	/**
	 * Checks whether the video is muted at a given offset or range.
	 *
	 * @param offset The start of your range, in seconds from the start of the video,
	 * or if no duration is given, the exact offset that is checked.
	 * @param duration The duration of your range, in seconds.
	 * @param partial Whether the range check is only partial.
	 *
	 * By default, this function returns true only if the passed range is entirely contained in a muted segment.
	 */
	isMutedAt(offset: number, duration?: number, partial = false): boolean {
		if (this[rawDataSymbol].muted_segments === null) {
			return false;
		}

		if (duration == null) {
			return this[rawDataSymbol].muted_segments.some(
				seg => seg.offset <= offset && offset <= seg.offset + seg.duration
			);
		}

		const end = offset + duration;

		if (partial) {
			return this[rawDataSymbol].muted_segments.some(seg => {
				const segEnd = seg.offset + seg.duration;

				return offset < segEnd && seg.offset < end;
			});
		}

		return this[rawDataSymbol].muted_segments.some(seg => {
			const segEnd = seg.offset + seg.duration;

			return seg.offset <= offset && end <= segEnd;
		});
	}
}
