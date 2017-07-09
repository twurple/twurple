import ChannelPlaceholder, {ChannelPlaceholderData} from './ChannelPlaceholder';
import Twitch from '../index';

export interface ChannelData extends ChannelPlaceholderData {
	_id: string;
	bio: string;
	created_at: string;
	display_name: string;
	logo: string;
	type: string;
	updated_at: string;
}

export default class Channel extends ChannelPlaceholder {
	constructor(_data: ChannelData, client: Twitch) {
		super(_data._id, client);
	}
}
