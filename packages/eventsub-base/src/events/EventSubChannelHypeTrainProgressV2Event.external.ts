import { type EventSubChannelHypeTrainType } from './common/EventSubChannelHypeTrainType.js';
import { type EventSubChannelHypeTrainContributionData } from './common/EventSubChannelHypeTrainContribution.external.js';
import { type EventSubChannelHypeTrainSharedParticipantData } from './common/EventSubChannelHypeTrainSharedParticipant.external.js';

/** @private */
export interface EventSubChannelHypeTrainProgressV2EventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	type: EventSubChannelHypeTrainType;
	level: number;
	total: number;
	progress: number;
	goal: number;
	top_contributions: EventSubChannelHypeTrainContributionData[];
	is_shared_train: boolean;
	shared_train_participants: EventSubChannelHypeTrainSharedParticipantData[];
	started_at: string;
	expires_at: string;
}
