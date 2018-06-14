import ChannelPlaceholder, { ChannelPlaceholderData } from './ChannelPlaceholder';
import TwitchClient from '../../TwitchClient';
import { ChannelUpdateData } from './ChannelAPI';

/** @private */
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
	profile_banner_background_color: string | null;
	status: string;
	updated_at: string;
	url: string;
	video_banner: string;
	views: number;
}

export default class Channel extends ChannelPlaceholder {
	/** @private */
	protected _data: ChannelData;

	/** @private */
	constructor(data: ChannelData, client: TwitchClient) {
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

	get broadcasterLanguage() {
		return this._data.broadcaster_language;
	}

	get broadcasterType() {
		return this._data.broadcaster_type;
	}

	get createdAt() {
		return new Date(this._data.created_at);
	}

	get description() {
		return this._data.description;
	}

	get followers() {
		return this._data.followers;
	}

	get game() {
		return this._data.game;
	}

	get language() {
		return this._data.language;
	}

	get logo() {
		return this._data.logo;
	}

	get isMature() {
		return this._data.mature;
	}

	get isPartner() {
		return this._data.partner;
	}

	get profileBanner() {
		return this._data.profile_banner;
	}

	get profileBannerBackgroundColor() {
		return this._data.profile_banner_background_color;
	}

	get status() {
		return this._data.status;
	}

	get updatedAt() {
		return new Date(this._data.updated_at);
	}

	get url() {
		return this._data.url;
	}

	get videoBanner() {
		return this._data.video_banner;
	}

	get views() {
		return this._data.views;
	}

}
