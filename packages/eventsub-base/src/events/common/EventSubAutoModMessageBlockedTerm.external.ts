import { type EventSubAutoModMessageAutoModBoundaryData } from './EventSubAutoModMessageAutoModBoundary.external.js';

/** @private */
export interface EventSubAutoModMessageBlockedTermData {
	terms_found: EventSubAutoModMessageFoundBlockedTermData[];
}

/** @private */
export interface EventSubAutoModMessageFoundBlockedTermData {
	term_id: string;
	owner_broadcaster_user_id: string;
	owner_broadcaster_user_login: string;
	owner_broadcaster_user_name: string;
	boundary: EventSubAutoModMessageAutoModBoundaryData;
}
