import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient, { TwitchAPICallOptions, TwitchAPICallType } from '../../TwitchClient';
import { HelixPaginatedResponse } from './HelixResponse';

if (!Object.prototype.hasOwnProperty.call(Symbol, 'asyncIterator')) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol.for('Symbol.asyncIterator');
}

/**
 * Represents a request to the new Twitch API (Helix) that utilizes a cursor to paginate through its results.
 *
 * Aside from the methods described below, you can also utilize the async iterator using `for await .. of`:
 *
 * ```ts
 * const result = client.helix.videos.getVideosByUser('125328655');
 * for await (const video of result) {
 *     console.log(video.title);
 * }
 * ```
 */
export default class HelixPaginatedRequest<D, T> {
	@NonEnumerable private readonly _client: TwitchClient;

	/** @private */
	protected _currentCursor?: string;

	/** @private */
	protected _isFinished = false;

	/** @private */
	protected _currentData?: HelixPaginatedResponse<D>;

	/** @private */
	constructor(
		private readonly _callOptions: Omit<TwitchAPICallOptions, 'type'>,
		client: TwitchClient,
		private readonly _mapper: (data: D) => T | T[]
	) {
		this._client = client;
	}

	/**
	 * The last retrieved page of data associated to the requested resource.
	 *
	 * Only works with {@HelixPaginatedRequest#getNext} and not with any other methods of data retrieval.
	 */
	get current() {
		return this._currentData ? this._currentData.data : undefined;
	}

	/**
	 * Retrieves and returns the next available page of data associated to the requested resource, or an empty array if there are no more available pages.
	 */
	async getNext() {
		if (this._isFinished) {
			return [];
		}

		const result = await this._fetchData();

		if (!result.data.length) {
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
	async getAll() {
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
	get currentCursor() {
		return this._currentCursor;
	}

	/**
	 * Resets the internal cursor.
	 *
	 * This will make {@HelixPaginatedRequest#getNext} start from the first page again.
	 */
	reset() {
		this._currentCursor = undefined;
		this._isFinished = false;
		this._currentData = undefined;
	}

	async *[Symbol.asyncIterator]() {
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
	protected async _fetchData(additionalOptions: Partial<TwitchAPICallOptions> = {}) {
		return this._client.callAPI<HelixPaginatedResponse<D>>({
			type: TwitchAPICallType.Helix,
			...this._callOptions,
			...additionalOptions,
			query: {
				...this._callOptions.query,
				after: this._currentCursor,
				first: '100',
				...additionalOptions.query
			}
		});
	}

	/** @private */
	protected _processResult(result: HelixPaginatedResponse<D>) {
		this._currentCursor = result.pagination ? result.pagination.cursor : undefined;
		if (this._currentCursor === undefined) {
			this._isFinished = true;
		}
		this._currentData = result;

		return result.data.reduce((acc, elem) => {
			const mapped = this._mapper(elem);
			return Array.isArray(mapped) ? [...acc, ...mapped] : [...acc, mapped];
		}, []);
	}
}
