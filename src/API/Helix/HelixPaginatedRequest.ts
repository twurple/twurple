import TwitchClient, { TwitchAPICallOptions } from '../../TwitchClient';
import { NonEnumerable } from '../../Toolkit/Decorators';
import { HelixPaginatedResponse } from './HelixResponse';

export default class HelixPaginatedRequest<D, T> {
	@NonEnumerable private readonly _client: TwitchClient;
	private readonly _callOptions: TwitchAPICallOptions;
	private readonly _mapper: (data: D) => T;

	private _currentCursor?: string;
	private _currentData?: D[];

	constructor(callOptions: TwitchAPICallOptions, client: TwitchClient, mapper: (data: D) => T) {
		this._callOptions = callOptions;
		this._client = client;
		this._mapper = mapper;
	}

	get current() {
		return this._currentData;
	}

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

	get currentCursor() {
		return this._currentCursor;
	}

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
