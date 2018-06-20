import BaseAPI from '../../BaseAPI';
import HelixResponse from '../HelixResponse';
import HelixStream, { HelixStreamData, HelixStreamType } from './HelixStream';
import { UniformObject } from '../../../Toolkit/ObjectTools';
import HelixPagination from '../HelixPagination';
import { TwitchApiCallType } from '../../../TwitchClient';
import HelixPaginatedResult from '../HelixPaginatedResult';

export interface HelixStreamFilter extends HelixPagination {
	community?: string | string[];
	game?: string | string[];
	language?: string | string[];
	type?: HelixStreamType;
	user?: string | string[];
	userName?: string | string[];
}

export default class HelixStreamAPI extends BaseAPI {
	async getStreams(filter?: HelixStreamFilter): Promise<HelixPaginatedResult<HelixStream[]>> {
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
				user_id: filter.user,
				user_login: filter.userName
			};
		}
		const result = await this._client.apiCall<HelixResponse<HelixStreamData[]>>({
			url: 'streams',
			type: TwitchApiCallType.Helix,
			query
		});

		return {
			data: result.data.map(streamData => new HelixStream(streamData, this._client)),
			cursor: result.pagination.cursor
		};
	}

	async getStreamByUserName(userName: string) {
		const streams = await this.getStreams({ userName });

		return streams.data.length ? streams.data[0] : null;
	}

	async getStreamByUserId(user: string) {
		const streams = await this.getStreams({ user });

		return streams.data.length ? streams.data[0] : null;
	}
}
