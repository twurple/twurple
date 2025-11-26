import { type EventSubAutoModLevel } from './EventSubAutoModLevel.js';
import { type EventSubAutoModMessageAutoModBoundaryData } from './EventSubAutoModMessageAutoModBoundary.external.js';

/** @private */
export interface EventSubAutoModMessageAutoModData {
	category: string;
	level: EventSubAutoModLevel;
	boundaries: EventSubAutoModMessageAutoModBoundaryData[];
}
