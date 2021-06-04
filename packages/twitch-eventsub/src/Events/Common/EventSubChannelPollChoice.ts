import type { EventSubChannelPollBeginChoiceData } from './EventSubChannelPollBeginChoice';

/** @private */
export interface EventSubChannelPollChoiceData extends EventSubChannelPollBeginChoiceData {
	bits_votes: number;
	channel_points_votes: number;
	votes: number;
}
