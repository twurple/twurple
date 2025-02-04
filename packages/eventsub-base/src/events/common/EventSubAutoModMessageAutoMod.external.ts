import { type EventSubAutoModLevel } from './EventSubAutoModLevel';
import { type EventSubAutoModMessageAutoModBoundaryData } from './EventSubAutoModMessageAutoModBoundary.external';

/** @private */
export interface EventSubAutoModMessageAutoModData {
	category: string;
	level: EventSubAutoModLevel;
	boundaries: EventSubAutoModMessageAutoModBoundaryData[];
}
