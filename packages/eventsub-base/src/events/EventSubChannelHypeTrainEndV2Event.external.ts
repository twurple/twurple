import { type EventSubChannelHypeTrainType } from './common/EventSubChannelHypeTrainType.js';
import { type EventSubChannelHypeTrainContributionData } from './common/EventSubChannelHypeTrainContribution.external.js';
import { type EventSubChannelHypeTrainSharedParticipantData } from './common/EventSubChannelHypeTrainSharedParticipant.external.js';

/** @private */
export interface EventSubChannelHypeTrainEndV2EventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	type: EventSubChannelHypeTrainType;
	level: number;
	total: number;
	top_contributions: EventSubChannelHypeTrainContributionData[];
	is_shared_train: boolean;
	shared_train_participants: EventSubChannelHypeTrainSharedParticipantData[];
	started_at: string;
	ended_at: string;
	cooldown_ends_at: string;
}
