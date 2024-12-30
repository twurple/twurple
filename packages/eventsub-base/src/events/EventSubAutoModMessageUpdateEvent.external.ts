import { type EventSubAutoModResolutionStatus } from './common/EventSubAutoModResolutionStatus';
import { type EventSubAutoModMessageHoldEventData } from './EventSubAutoModMessageHoldEvent.external';

/** @private */
export interface EventSubAutoModMessageUpdateEventData extends EventSubAutoModMessageHoldEventData {
	moderator_user_id: string;
	moderator_user_login: string;
	moderator_user_name: string;
	status: EventSubAutoModResolutionStatus;
}
