import { type EventSubAutoModMessageData } from './common/EventSubAutoModMessage.external.js';
import { type EventSubAutoModMessageHoldReason } from './common/EventSubAutoModMessageHoldReason.js';
import { type EventSubAutoModMessageBlockedTermData } from './common/EventSubAutoModMessageBlockedTerm.external.js';
import { type EventSubAutoModMessageAutoModData } from './common/EventSubAutoModMessageAutoMod.external.js';

/** @private */
export interface EventSubAutoModMessageHoldV2EventData {
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	user_id: string;
	user_login: string;
	user_name: string;
	message_id: string;
	message: EventSubAutoModMessageData;
	reason: EventSubAutoModMessageHoldReason;
	automod: EventSubAutoModMessageAutoModData | null;
	blocked_term: EventSubAutoModMessageBlockedTermData | null;
	held_at: string;
}
