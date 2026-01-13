import { type UserIdResolvable } from '@twurple/common';
import { type HelixPagination } from '../../utils/pagination/HelixPagination.js';
import { type HelixClipFilterType } from './clip.external.js';

/**
 * Filters for clip queries.
 */
export interface HelixClipFilter {
	/**
	 * The earliest date to find clips for.
	 */
	startDate?: string;

	/**
	 * The latest date to find clips for.
	 */
	endDate?: string;

	/**
	 * The featured flag the results should have.
	 *
	 * If not given, both featured and non-featured clips will be returned.
	 */
	isFeatured?: boolean;
}

/**
 * @inheritDoc
 */
export interface HelixPaginatedClipFilter extends HelixClipFilter, HelixPagination {}

/** @private */
export interface HelixClipIdFilterPart {
	filterType: HelixClipFilterType;
	ids: string | string[];
	userId?: string;
}

/** @private */
export interface HelixClipIdFilter extends HelixClipFilter, HelixClipIdFilterPart {}

/** @private */
export interface HelixPaginatedClipIdFilter extends HelixPaginatedClipFilter, HelixClipIdFilterPart {}

/** @private */
interface HelixBaseClipCreateParams {
	/**
	 * The broadcaster of which you want to create a clip.
	 */
	channel: UserIdResolvable;

	/**
	 * The title of the clip. If not given, the title of the clip will be the same as the title of the stream.
	 */
	title?: string;

	/**
	 * The duration of the clip, in seconds. The valid range is 5-60, with a precision of 0.1.
	 *
	 * If not given, the duration of the clip will be 30 seconds.
	 */
	duration?: number;
}

/**
 * Parameters for creating a clip from a live stream.
 *
 * @inheritDoc
 */
export interface HelixClipCreateParams extends HelixBaseClipCreateParams {
	/**
	 * Add a delay before the clip creation that accounts for the usual delay in the viewing experience.
	 */
	createAfterDelay?: boolean;
}

/**
 * Parameters for creating a clip from a VOD.
 *
 * @beta
 * @inheritDoc
 */
export interface HelixClipCreateFromVodParams extends HelixBaseClipCreateParams {
	/**
	 * The ID of the VOD to create a clip from.
	 */
	vodId: string;

	/**
	 * The offset of the VOD to **end** the clip on. Must be higher than `duration`.
	 */
	vodOffset: number;
}
