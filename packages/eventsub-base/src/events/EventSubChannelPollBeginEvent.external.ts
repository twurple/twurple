import { type EventSubChannelPollBeginChoiceData } from './common/EventSubChannelPollBeginChoice.external.js';
import { type EventSubChannelPollVoteTypeSettingsData } from './common/EventSubChannelPollVoteTypeSettings.external.js';

/** @private */
export interface EventSubChannelPollBeginEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	title: string;
	choices: EventSubChannelPollBeginChoiceData[];
	bits_voting: EventSubChannelPollVoteTypeSettingsData;
	channel_points_voting: EventSubChannelPollVoteTypeSettingsData;
	started_at: string;
	ends_at: string;
}
