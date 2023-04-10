import { type HelixForwardPagination } from '../../utils/pagination/HelixPagination';

/**
 * Filters for a channel search.
 */
export interface HelixChannelSearchFilter {
	/**
	 * Include only channels that are currently live.
	 */
	liveOnly?: boolean;
}

/** @inheritDoc */
export interface HelixPaginatedChannelSearchFilter extends HelixChannelSearchFilter, HelixForwardPagination {}
