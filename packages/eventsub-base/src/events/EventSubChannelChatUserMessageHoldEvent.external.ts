import { type EventSubAutoModMessageData } from './common/EventSubAutoModMessage.external';

/** @private */
export interface EventSubChannelChatUserMessageHoldEventData {
	broadcaster_user_id: string;
	broadcaster_user_name: string;
	broadcaster_user_login: string;
	user_id: string;
	user_name: string;
	user_login: string;
	message_id: string;
	message: EventSubAutoModMessageData;
}
