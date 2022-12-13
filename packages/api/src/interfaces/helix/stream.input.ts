import { type HelixPagination } from '../../api/helix/HelixPagination';
import { type HelixStreamType } from './stream.external';

/**
 * Filters for the streams request.
 */
export interface HelixStreamFilter {
	/**
	 * A game ID or a list thereof.
	 */
	game?: string | string[];

	/**
	 * A language or a list thereof.
	 */
	language?: string | string[];

	/**
	 * A type of stream.
	 */
	type?: HelixStreamType;

	/**
	 * A user ID or a list thereof.
	 */
	userId?: string | string[];

	/**
	 * A user name or a list thereof.
	 */
	userName?: string | string[];
}

/**
 * @inheritDoc
 */
export interface HelixPaginatedStreamFilter extends HelixStreamFilter, HelixPagination {}
