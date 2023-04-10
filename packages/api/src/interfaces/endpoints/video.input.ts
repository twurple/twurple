import { type HelixPagination } from '../../utils/pagination/HelixPagination';
import { type HelixVideoFilterPeriod, type HelixVideoSort, type HelixVideoType } from './video.external';

/**
 * Filters for the videos request.
 */
export interface HelixVideoFilter {
	/**
	 * The language of the videos.
	 */
	language?: string;

	/**
	 * The period of time when the videos were created.
	 */
	period?: HelixVideoFilterPeriod;

	/**
	 * The value to order the videos by.
	 */
	orderBy?: HelixVideoSort;

	/**
	 * The type of the videos.
	 */
	type?: HelixVideoType | 'all';
}

/**
 * @inheritDoc
 */
export interface HelixPaginatedVideoFilter extends HelixVideoFilter, HelixPagination {}
