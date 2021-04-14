/// <reference lib="esnext.asynciterable" />

import { Enumerable } from '@d-fischer/shared-utils';
import type { TwitchApiCallOptions } from '@twurple/api-call';
import { TwitchApiCallType } from '@twurple/api-call';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../ApiClient';
import type { HelixPaginatedResponse } from './HelixResponse';

if (!Object.prototype.hasOwnProperty.call(Symbol, 'asyncIterator')) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unnecessary-condition,@typescript-eslint/no-unsafe-member-access
	(Symbol as any).asyncIterator = Symbol.asyncIterator ?? Symbol.for('Symbol.asyncIterator');
}

/**
 * Represents a request to the new Twitch API (Helix) that utilizes a cursor to paginate through its results.
 *
 * Aside from the methods described below, you can also utilize the async iterator using `for await .. of`:
 *
 * ```ts
 * const result = client.helix.videos.getVideosByUserPaginated('125328655');
 * for await (const video of result) {
 *     console.log(video.title);
 * }
 * ```
 */
@rtfm('api', 'HelixPaginatedRequest')
export class HelixPaginatedRequest<D, T> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	protected _currentCursor?: string;

	/** @private */
	protected _isFinished = false;

	/** @private */
	protected _currentData?: HelixPaginatedResponse<D>;

	/** @private */
	constructor(
		private readonly _callOptions: Omit<TwitchApiCallOptions, 'type'>,
		client: ApiClient,
		private readonly _mapper: (data: D) => T | T[],
		private readonly _limitPerPage: number = 100
	) {
		this._client = client;
	}

	/**
	 * The last retrieved page of data associated to the requested resource.
	 *
	 * Only works with {@HelixPaginatedRequest#getNext} and not with any other methods of data retrieval.
	 */
	get current(): D[] | undefined {
		return this._currentData?.data;
	}

	/**
	 * Retrieves and returns the next available page of data associated to the requested resource, or an empty array if there are no more available pages.
	 */
	async getNext(): Promise<T[]> {
		if (this._isFinished) {
			return [];
		}

		const result = await this._fetchData();

		// should never be null, but in practice is sometimes
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!result.data?.length) {
			this._isFinished = true;
			return [];
		}

		return this._processResult(result);
	}

	/**
	 * Retrieves and returns all data associated to the requested resource.
	 *
	 * Be aware that this makes multiple calls to the Twitch API. Due to this, you might be more suspectible to rate limits.
	 *
	 * Also be aware that this resets the internal cursor, so avoid using this and {@HelixPaginatedRequest#getNext} together.
	 */
	async getAll(): Promise<T[]> {
		this.reset();
		const result = [];
		do {
			const data = await this.getNext();
			if (!data.length) {
				break;
			}
			result.push(...data);
		} while (this._currentCursor);
		this.reset();

		return result;
	}

	/**
	 * Retrieves the current cursor.
	 *
	 * Only useful if you want to make manual requests to the API.
	 */
	get currentCursor(): string | undefined {
		return this._currentCursor;
	}

	/**
	 * Resets the internal cursor.
	 *
	 * This will make {@HelixPaginatedRequest#getNext} start from the first page again.
	 */
	reset(): void {
		this._currentCursor = undefined;
		this._isFinished = false;
		this._currentData = undefined;
	}

	async *[Symbol.asyncIterator](): AsyncGenerator<T, void, undefined> {
		this.reset();
		while (true) {
			const data = await this.getNext();
			if (!data.length) {
				break;
			}
			yield* data[Symbol.iterator]();
		}
	}

	/** @private */
	protected async _fetchData(
		additionalOptions: Partial<TwitchApiCallOptions> = {}
	): Promise<HelixPaginatedResponse<D>> {
		return this._client.callApi<HelixPaginatedResponse<D>>({
			type: TwitchApiCallType.Helix,
			...this._callOptions,
			...additionalOptions,
			query: {
				...this._callOptions.query,
				after: this._currentCursor,
				first: this._limitPerPage.toString(),
				...additionalOptions.query
			}
		});
	}

	/** @private */
	protected _processResult(result: HelixPaginatedResponse<D>): T[] {
		this._currentCursor = result.pagination ? result.pagination.cursor : undefined;
		if (this._currentCursor === undefined) {
			this._isFinished = true;
		}
		this._currentData = result;

		return result.data.reduce<T[]>((acc, elem) => {
			const mapped = this._mapper(elem);
			return Array.isArray(mapped) ? [...acc, ...mapped] : [...acc, mapped];
		}, []);
	}
}
