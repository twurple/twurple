import { Enumerable, indexBy, promiseWithResolvers } from '@d-fischer/shared-utils';
import { type HelixPaginatedResponse } from '@twurple/api-call';
import { type BaseApiClient } from '../client/BaseApiClient.js';
import { type ContextApiCallOptions } from '../client/ContextApiCallOptions.js';

/** @internal */
interface RequestResolver<T> {
	resolve: (value: T) => void;
	reject: (error: Error) => void;
}

/** @internal */
export class HelixRequestBatcher<D, T> {
	@Enumerable(false) private readonly _client: BaseApiClient;

	private readonly _requestedIds: string[] = [];
	private readonly _requestResolversById = new Map<string, Array<RequestResolver<T | null>>>();

	private readonly _delay: number;
	private _waitTimer: ReturnType<typeof setTimeout> | null = null;

	constructor(
		private readonly _callOptions: Omit<ContextApiCallOptions, 'type'>,
		private readonly _queryParamName: string,
		private readonly _matchKey: Extract<keyof D, string>,
		client: BaseApiClient,
		private readonly _mapper: (data: D) => T,
		private readonly _limitPerRequest: number = 100,
	) {
		this._client = client;
		this._delay = client._batchDelay;
	}

	async request(id: string): Promise<T | null> {
		const { promise, resolve, reject } = promiseWithResolvers<T | null>();
		if (!this._requestedIds.includes(id)) {
			this._requestedIds.push(id);
		}
		if (this._requestResolversById.has(id)) {
			this._requestResolversById.get(id)!.push({ resolve, reject });
		} else {
			this._requestResolversById.set(id, [{ resolve, reject }]);
		}

		if (this._waitTimer) {
			clearTimeout(this._waitTimer);
			this._waitTimer = null;
		}
		if (this._requestedIds.length >= this._limitPerRequest) {
			void this._handleBatch(this._requestedIds.splice(0, this._limitPerRequest));
		} else {
			this._waitTimer = setTimeout(() => {
				void this._handleBatch(this._requestedIds.splice(0, this._limitPerRequest));
			}, this._delay);
		}

		return await promise;
	}

	private async _handleBatch(ids: string[]): Promise<void> {
		try {
			const { data } = await this._doRequest(ids);
			const dataById = indexBy(data, this._matchKey);
			for (const id of ids) {
				for (const resolver of this._requestResolversById.get(id) ?? []) {
					if (Object.prototype.hasOwnProperty.call(dataById, id)) {
						resolver.resolve(this._mapper(dataById[id]));
					} else {
						resolver.resolve(null);
					}
				}
				this._requestResolversById.delete(id);
			}
		} catch (e) {
			await Promise.all(
				ids.map(async id => {
					try {
						const result = await this._doRequest([id]);

						for (const resolver of this._requestResolversById.get(id) ?? []) {
							resolver.resolve(result.data.length ? this._mapper(result.data[0]) : null);
						}
					} catch (e_) {
						for (const resolver of this._requestResolversById.get(id) ?? []) {
							resolver.reject(e_ as Error);
						}
					}
					this._requestResolversById.delete(id);
				}),
			);
		}
	}

	private async _doRequest(ids: string[]): Promise<HelixPaginatedResponse<D>> {
		return await this._client.callApi({
			type: 'helix',
			...this._callOptions,
			query: {
				...this._callOptions.query,
				[this._queryParamName]: ids,
			},
		});
	}
}
