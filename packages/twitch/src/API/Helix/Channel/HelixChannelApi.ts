import { TwitchApiCallType } from 'twitch-api-call';
import type { UserIdResolvable, CommercialLength } from 'twitch-common';
import { extractUserId, rtfm } from 'twitch-common';
import { BaseApi } from '../../BaseApi';
import type { HelixPaginatedResponse } from '../HelixResponse';
import type { HelixChannelData } from './HelixChannel';
import { HelixChannel } from './HelixChannel';

/**
 * Channel data to update using {@HelixChannelApi#updateChannel}.
 */
export interface HelixChannelUpdate {
	/**
	 * The language of the stream.
	 */
	language?: string;

	/**
	 * The ID of the game you're playing.
	 */
	gameId?: string;

	/**
	 * The title of the stream.
	 */
	title?: string;
}

/**
 * The Helix API methods that deal with channels.
 *
 * Can be accessed using `client.helix.channels` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const channel = await api.helix.channels.getChannelInfo('125328655');
 * ```
 */
@rtfm('twitch', 'HelixChannelApi')
export class HelixChannelApi extends BaseApi {
	/**
	 * Retrieves the channel data for the given user.
	 *
	 * @param user The user you want to get channel info for.
	 */
	async getChannelInfo(user: UserIdResolvable): Promise<HelixChannel | null> {
		const userId = extractUserId(user);
		const result = await this._client.callApi<HelixPaginatedResponse<HelixChannelData>>({
			type: TwitchApiCallType.Helix,
			url: 'channels',
			query: {
				broadcaster_id: userId
			}
		});

		return result.data.length ? new HelixChannel(result.data[0], this._client) : null;
	}

	/**
	 * Updates the given user's channel data.
	 *
	 * @param user The user you want to update channel info for.
	 * @param data The channel info to set.
	 */
	async updateChannelInfo(user: UserIdResolvable, data: HelixChannelUpdate): Promise<void> {
		const userId = extractUserId(user);
		await this._client.callApi({
			type: TwitchApiCallType.Helix,
			url: 'channels',
			method: 'PATCH',
			scope: 'user:edit:broadcast',
			query: {
				broadcaster_id: userId
			},
			jsonBody: {
				game_id: data.gameId,
				broadcaster_language: data.language,
				title: data.title
			}
		});
	}

	/**
	 * Starts a commercial on a channel.
	 *
	 * @param broadcaster The broadcaster on whose channel the commercial is started.
	 * @param length The length of the commercial, in seconds.
	 */
	async startChannelCommercial(broadcaster: UserIdResolvable, length: CommercialLength): Promise<void> {
		await this._client.callApi({
			type: TwitchApiCallType.Helix,
			url: 'channels/commercial',
			method: 'POST',
			scope: 'channel:edit:commercial',
			jsonBody: {
				broadcaster_id: extractUserId(broadcaster),
				length: length
			}
		});
	}
}
