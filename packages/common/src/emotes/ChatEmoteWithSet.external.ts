import { type ChatEmoteData } from './ChatEmote.external';

/** @private */
export interface ChatEmoteWithSetData extends ChatEmoteData {
	emoticon_set: number;
}
