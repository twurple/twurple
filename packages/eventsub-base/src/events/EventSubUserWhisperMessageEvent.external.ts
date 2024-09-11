/** @private */
export interface EventSubUserWhisperMessageData {
	text: string;
}

/** @private */
export interface EventSubUserWhisperMessageEventData {
	from_user_id: string;
	from_user_login: string;
	from_user_name: string;
	to_user_id: string;
	to_user_login: string;
	to_user_name: string;
	whisper_id: string;
	whisper: EventSubUserWhisperMessageData;
}
