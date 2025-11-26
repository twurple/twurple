import { type EventSubChannelSharedChatSessionParticipantData } from './common/EventSubChannelSharedChatSessionParticipant.external.js';

/** @private */
export interface EventSubChannelSharedChatSessionBeginEventData {
	session_id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	host_broadcaster_user_id: string;
	host_broadcaster_user_login: string;
	host_broadcaster_user_name: string;
	participants: EventSubChannelSharedChatSessionParticipantData[];
}
