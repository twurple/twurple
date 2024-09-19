import { type EventSubChannelSuspiciousUserLowTrustStatus } from './common/EventSubChannelSuspiciousUserLowTrustStatus';

/** @private */
export interface EventSubChannelSuspiciousUserUpdateEventData {
	broadcaster_user_id: string;
	broadcaster_user_name: string;
	broadcaster_user_login: string;
	moderator_user_id: string;
	moderator_user_name: string;
	moderator_user_login: string;
	user_id: string;
	user_name: string;
	user_login: string;
	low_trust_status: EventSubChannelSuspiciousUserLowTrustStatus;
}
