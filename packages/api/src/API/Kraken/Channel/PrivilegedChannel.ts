import type { CommercialLength } from '@twurple/common';
import { rtfm } from '@twurple/common';
import type { User } from '../User/User';
import type { ChannelData } from './Channel';
import { Channel } from './Channel';

/** @private */
export interface PrivilegedChannelData extends ChannelData {
	stream_key: string;
	email: string;
}

/**
 * A channel you have extended privileges for, i.e. the channel of the currently authenticated user.
 */
@rtfm<PrivilegedChannel>('api', 'PrivilegedChannel', 'id')
export class PrivilegedChannel extends Channel {
	/** @private */ protected declare readonly _data: PrivilegedChannelData;

	/**
	 * The channel's stream key.
	 */
	get streamKey(): string {
		return this._data.stream_key;
	}

	/**
	 * The channel's email address.
	 */
	get email(): string {
		return this._data.email;
	}

	/**
	 * Retrieves the list of editors of the channel.
	 */
	async getEditors(): Promise<User[]> {
		return await this._client.kraken.channels.getChannelEditors(this);
	}

	/**
	 * Starts a commercial in the channel.
	 *
	 * @param length The length of the commercial.
	 */
	async startCommercial(length: CommercialLength): Promise<void> {
		await this._client.kraken.channels.startChannelCommercial(this, length);
	}

	/**
	 * Resets the given channel's stream key.
	 */
	async resetStreamKey(): Promise<string> {
		const channelData = await this._client.kraken.channels.resetChannelStreamKey(this);
		const streamKey = channelData.streamKey;
		this._data.stream_key = streamKey;

		return streamKey;
	}
}
