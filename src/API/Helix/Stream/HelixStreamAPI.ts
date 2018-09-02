import BaseAPI from '../../BaseAPI';
import { HelixPaginatedResponse } from '../HelixResponse';
import HelixStream, { HelixStreamData, HelixStreamType } from './HelixStream';
import { UniformObject } from '../../../Toolkit/ObjectTools';
import HelixPagination from '../HelixPagination';
import { TwitchApiCallType } from '../../../TwitchClient';
import HelixPaginatedResult from '../HelixPaginatedResult';

/**
 * Filters for the Helix Stream API.
 */
export interface HelixStreamFilter extends HelixPagination {
	/**
	 * A community ID or a list thereof.
	 */
	community?: string | string[];

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
	 *
	 * @deprecated Use `userId` instead.
	 */
	user?: string | string[];

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
 * The Helix API methods that deal with streams.
 *
 * Can be accessed using `client.helix.streams` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = new TwitchClient(options);
 * const stream = await client.helix.streams.getStreamByUserId('125328655');
 * ```
 */
export default class HelixStreamAPI extends BaseAPI {
	/**
	 * Retrieves a list of streams.
	 *
	 * @param filter Several filtering and pagination parameters. See the {@HelixStreamFilter} documentation.
	 */
	async getStreams(filter?: HelixStreamFilter): Promise<HelixPaginatedResult<HelixStream>> {
		let query: UniformObject<string | string[] | undefined> = {};
		if (filter) {
			query = {
				after: filter.after,
				before: filter.before,
				first: filter.limit,
				community_id: filter.community,
				game_id: filter.game,
				language: filter.language,
				type: filter.type,
				user_id: filter.userId || filter.user, // tslint:disable-line:deprecation
				user_login: filter.userName
			};
		}
		const result = await this._client.apiCall<HelixPaginatedResponse<HelixStreamData>>({
			url: 'streams',
			type: TwitchApiCallType.Helix,
			query
		});

		return {
			data: result.data.map(streamData => new HelixStream(streamData, this._client)),
			cursor: result.pagination.cursor
		};
	}

	/**
	 * Retrieves the current stream for the given user name.
	 *
	 * @param userName The user name to retrieve the stream for.
	 */
	async getStreamByUserName(userName: string) {
		const streams = await this.getStreams({ userName });

		return streams.data.length ? streams.data[0] : null;
	}

	/**
	 * Retrieves the current stream for the given user ID.
	 *
	 * @param userId The user ID to retrieve the stream for.
	 */
	async getStreamByUserId(userId: string) {
		const streams = await this.getStreams({ userId });

		return streams.data.length ? streams.data[0] : null;
	}
}
