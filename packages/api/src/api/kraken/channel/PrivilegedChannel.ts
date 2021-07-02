import type { CommercialLength } from '@twurple/common';
import { rawDataSymbol, rtfm } from '@twurple/common';
import type { User } from '../user/User';
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
	/** @private */ declare readonly [rawDataSymbol]: PrivilegedChannelData;

	/**
	 * The channel's stream key.
	 */
	get streamKey(): string {
		return this[rawDataSymbol].stream_key;
	}

	/**
	 * The channel's email address.
	 */
	get email(): string {
		return this[rawDataSymbol].email;
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
		this[rawDataSymbol].stream_key = streamKey;

		return streamKey;
	}
}
