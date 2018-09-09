import BaseAPI from '../../BaseAPI';
import HelixStream, { HelixStreamData, HelixStreamType } from './HelixStream';
import { TwitchAPICallType } from '../../../TwitchClient';
import HelixPaginatedRequest from '../HelixPaginatedRequest';

/**
 * Filters for the streams request.
 */
export interface HelixStreamFilter {
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
	getStreams(filter: HelixStreamFilter = {}) {
		return new HelixPaginatedRequest(
			{
				url: 'streams',
				type: TwitchAPICallType.Helix,
				query: {
					community_id: filter.community,
					game_id: filter.game,
					language: filter.language,
					type: filter.type,
					user_id: filter.userId || filter.user, // tslint:disable-line:deprecation
					user_login: filter.userName
				}
			},
			this._client,
			(data: HelixStreamData) => new HelixStream(data, this._client)
		);
	}

	/**
	 * Retrieves the current stream for the given user name.
	 *
	 * @param userName The user name to retrieve the stream for.
	 */
	async getStreamByUserName(userName: string) {
		const req = this.getStreams({ userName });
		const streams = await req.getAll();

		return streams.length ? streams[0] : null;
	}

	/**
	 * Retrieves the current stream for the given user ID.
	 *
	 * @param userId The user ID to retrieve the stream for.
	 */
	async getStreamByUserId(userId: string) {
		const req = this.getStreams({ userId });
		const streams = await req.getAll();

		return streams.length ? streams[0] : null;
	}
}
