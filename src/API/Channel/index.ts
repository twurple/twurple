import ChannelPlaceholder, { ChannelPlaceholderData } from './ChannelPlaceholder';
import Twitch from '../../';
import { ChannelUpdateData } from './ChannelAPI';

export interface ChannelData extends ChannelPlaceholderData {
	broadcaster_language: string;
	broadcaster_type: string;
	created_at: string;
	description: string;
	display_name: string;
	followers: number;
	game: string;
	language: string;
	logo: string;
	mature: boolean;
	name: string;
	partner: boolean;
	profile_banner: string | null;
	profile_bannel_background_color: string | null;
	status: string;
	updated_at: string;
	url: string;
	video_banner: string;
	views: number;
}

export default class Channel extends ChannelPlaceholder {
	protected _data: ChannelData;

	constructor(data: ChannelData, client: Twitch) {
		super(data._id, client);
		this._data = data;
	}

	// override parent's method so we avoid the API/cache request here if someone wrongly assumes this is a placeholder
	async getChannel() {
		return this;
	}

	async update(data: ChannelUpdateData) {
		return this._client.channels.updateChannel(this, data);
	}

	get name() {
		return this._data.name;
	}

	get displayName() {
		return this._data.display_name;
	}
}
