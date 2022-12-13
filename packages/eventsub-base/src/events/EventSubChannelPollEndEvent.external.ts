import { type EventSubChannelPollChoiceData } from './common/EventSubChannelPollChoice.external';
import { type EventSubChannelPollVoteTypeSettingsData } from './common/EventSubChannelPollVoteTypeSettings.external';

/**
 * The status of the poll.
 */
export type EventSubChannelPollEndStatus = 'completed' | 'archived' | 'terminated';

/** @private */
export interface EventSubChannelPollEndEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	title: string;
	choices: EventSubChannelPollChoiceData[];
	bits_voting: EventSubChannelPollVoteTypeSettingsData;
	channel_points_voting: EventSubChannelPollVoteTypeSettingsData;
	status: EventSubChannelPollEndStatus;
	started_at: string;
	ended_at: string;
}
