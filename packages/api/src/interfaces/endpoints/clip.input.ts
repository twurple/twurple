import { type UserIdResolvable } from '@twurple/common';
import { type HelixPagination } from '../../utils/pagination/HelixPagination';
import { type HelixClipFilterType } from './clip.external';

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

/**
 * Parameters for creating a clip.
 */
export interface HelixClipCreateParams {
	/**
	 * The broadcaster of which you want to create a clip.
	 */
	channel: UserIdResolvable;

	/**
	 * Add a delay before the clip creation that accounts for the usual delay in the viewing experience.
	 */
	createAfterDelay?: boolean;
}
