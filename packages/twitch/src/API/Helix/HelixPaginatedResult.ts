/**
 * A result coming from a Helix resource that is paginated using a cursor.
 */
import { ConstructedType } from '@d-fischer/shared-utils';
import TwitchClient from '../../TwitchClient';
import { HelixPaginatedResponse, HelixPaginatedResponseWithTotal } from './HelixResponse';

export default interface HelixPaginatedResult<T> {
	/**
	 * The returned data.
	 */
	data: T[];

	/**
	 * A cursor for traversing more results.
	 */
	cursor?: string;
}

/**
 * A result coming from a Helix resource that is paginated using a cursor, also including a total number of items.
 */
export interface HelixPaginatedResultWithTotal<T> {
	/**
	 * The returned data.
	 */
	data: T[];

	/**
	 * A cursor for traversing more results.
	 */
	cursor: string;

	/**
	 * The total number of items.
	 */
	total: number;
}

/** @private */
export function createPaginatedResult<
	I extends object,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	O extends new (data: I, client: TwitchClient) => any
>(response: HelixPaginatedResponse<I>, type: O, client: TwitchClient): HelixPaginatedResult<ConstructedType<O>> {
	return {
		data: response.data.map(data => new type(data, client)),
		cursor: response.pagination?.cursor
	};
}

/** @private */
export function createPaginatedResultWithTotal<
	I extends object,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	O extends new (data: I, client: TwitchClient) => any
>(
	response: HelixPaginatedResponseWithTotal<I>,
	type: O,
	client: TwitchClient
): HelixPaginatedResultWithTotal<ConstructedType<O>> {
	return {
		data: response.data.map(data => new type(data, client)),
		cursor: response.pagination!.cursor,
		total: response.total
	};
}
