import type { HelixPaginatedResponse, HelixResponse } from '@twurple/api-call';
import type { CommercialLength, UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { BaseApi } from '../../BaseApi';
import type { HelixChannelData } from './HelixChannel';
import { HelixChannel } from './HelixChannel';
import type { HelixChannelEditorData } from './HelixChannelEditor';
import { HelixChannelEditor } from './HelixChannelEditor';

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

	/**
	 * The delay of the stream, in seconds.
	 *
	 * Only works if you're a Twitch partner.
	 */
	delay?: number;
}

/**
 * The Helix API methods that deal with channels.
 *
 * Can be accessed using `client.channels` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const channel = await api.channels.getChannelInfo('125328655');
 * ```
 */
@rtfm('api', 'HelixChannelApi')
export class HelixChannelApi extends BaseApi {
	/**
	 * Retrieves the channel data for the given user.
	 *
	 * @param user The user you want to get channel info for.
	 */
	async getChannelInfo(user: UserIdResolvable): Promise<HelixChannel | null> {
		const userId = extractUserId(user);
		const result = await this._client.callApi<HelixPaginatedResponse<HelixChannelData>>({
			type: 'helix',
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
			type: 'helix',
			url: 'channels',
			method: 'PATCH',
			scope: 'channel:manage:broadcast',
			query: {
				broadcaster_id: userId
			},
			jsonBody: {
				game_id: data.gameId,
				broadcaster_language: data.language,
				title: data.title,
				delay: data.delay?.toString()
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
			type: 'helix',
			url: 'channels/commercial',
			method: 'POST',
			scope: 'channel:edit:commercial',
			jsonBody: {
				broadcaster_id: extractUserId(broadcaster),
				length: length
			}
		});
	}

	/**
	 * Retrieves a list of users who have editor permissions on your channel.
	 *
	 * @param broadcaster The broadcaster to retreive the editors for.
	 */
	async getChannelEditors(broadcaster: UserIdResolvable): Promise<HelixChannelEditor[]> {
		const result = await this._client.callApi<HelixResponse<HelixChannelEditorData>>({
			type: 'helix',
			url: 'channels/editors',
			scope: 'channel:read:editors',
			query: {
				broadcaster_id: extractUserId(broadcaster)
			}
		});

		return result.data.map(data => new HelixChannelEditor(data, this._client));
	}
}
