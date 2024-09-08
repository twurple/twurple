import { type EventSubAutoModMessageData } from './common/EventSubAutoModMessage.external';
import { type EventSubAutoModResolutionStatus } from './common/EventSubAutoModResolutionStatus';

/** @private */
export interface EventSubChannelChatUserMessageUpdateEventData {
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	user_id: string;
	user_login: string;
	user_name: string;
	message_id: string;
	message: EventSubAutoModMessageData;
	status: EventSubAutoModResolutionStatus;
}
