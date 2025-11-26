import { type EventSubAutoModLevel } from './common/EventSubAutoModLevel.js';

/** @private */
export interface EventSubAutoModSettingsUpdateEventData {
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	moderator_user_id: string;
	moderator_user_login: string;
	moderator_user_name: string;
	overall_level: EventSubAutoModLevel | null;
	disability: EventSubAutoModLevel;
	aggression: EventSubAutoModLevel;
	sexuality_sex_or_gender: EventSubAutoModLevel;
	misogyny: EventSubAutoModLevel;
	bullying: EventSubAutoModLevel;
	swearing: EventSubAutoModLevel;
	race_ethnicity_or_religion: EventSubAutoModLevel;
	sex_based_terms: EventSubAutoModLevel;
}
