import TwitchClient, { TwitchAPICallOptions } from '../../TwitchClient';
import { NonEnumerable } from '../../Toolkit/Decorators';
import { HelixPaginatedResponse } from './HelixResponse';

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
	private readonly _callOptions: TwitchAPICallOptions;
	private readonly _mapper: (data: D) => T;

	private _currentCursor?: string;
	private _currentData?: D[];

	/** @private */
	constructor(callOptions: TwitchAPICallOptions, client: TwitchClient, mapper: (data: D) => T) {
		this._callOptions = callOptions;
		this._client = client;
		this._mapper = mapper;
	}

	/**
	 * The last retrieved page of data associated to the requested resource.
	 *
	 * Only works with {@HelixPaginatedRequest#getNext} and not with any other methods of data retrieval.
	 */
	get current() {
		return this._currentData;
	}

	/**
	 * Retrieves and returns the next available page of data associated to the requested resource, or an empty array if there are no more available pages.
	 */
	async getNext() {
		const result = await this._client.callAPI<HelixPaginatedResponse<D>>({
			...this._callOptions,
			query: {
				...this._callOptions.query,
				after: this._currentCursor,
				first: '100'
			}
		});

		if (!result.data.length) {
			return [];
		}

		this._currentCursor = result.pagination.cursor;
		this._currentData = result.data;

		return result.data.map(this._mapper);
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
	}
}

// tslint:disable-next-line:strict-type-predicates
if (typeof Symbol === 'function' && typeof Symbol.asyncIterator === 'symbol') {
	Object.defineProperty(HelixPaginatedRequest.prototype, Symbol.asyncIterator, {
		value: async function* <D, T>(this: HelixPaginatedRequest<D, T>) {
			this.reset();
			while (true) {
				const data = await this.getNext();
				if (!data.length) {
					break;
				}
				yield* data[Symbol.iterator]();
			}
		}
	});
}
