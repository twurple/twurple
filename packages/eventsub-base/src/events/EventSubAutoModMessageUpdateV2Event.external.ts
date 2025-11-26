import { type EventSubAutoModResolutionStatus } from './common/EventSubAutoModResolutionStatus.js';
import { type EventSubAutoModMessageHoldV2EventData } from './EventSubAutoModMessageHoldV2Event.external.js';

/** @private */
export interface EventSubAutoModMessageUpdateV2EventData extends EventSubAutoModMessageHoldV2EventData {
	moderator_user_id: string;
	moderator_user_login: string;
	moderator_user_name: string;
	status: EventSubAutoModResolutionStatus;
}
