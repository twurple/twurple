import { type EventSubAutoModLevel } from './common/EventSubAutoModLevel';
import { type EventSubAutoModMessageData } from './common/EventSubAutoModMessage.external';
import { type EventSubAutoModResolutionStatus } from './common/EventSubAutoModResolutionStatus';

/** @private */
export interface EventSubAutoModMessageUpdateEventData {
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	moderator_user_id: string;
	moderator_user_login: string;
	moderator_user_name: string;
	user_id: string;
	user_login: string;
	user_name: string;
	message_id: string;
	message: EventSubAutoModMessageData;
	level: EventSubAutoModLevel;
	category: string;
	status: EventSubAutoModResolutionStatus;
	held_at: string;
}
