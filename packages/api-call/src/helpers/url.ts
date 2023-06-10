import type { TwitchApiCallType } from '../TwitchApiCallOptions';

/** @internal */
export function getTwitchApiUrl(url: string, type: TwitchApiCallType): string {
	switch (type) {
		case 'helix':
			return `https://api.twitch.tv/helix/${url.replace(/^\//, '')}`;
		case 'auth':
			return `https://id.twitch.tv/oauth2/${url.replace(/^\//, '')}`;
		case 'custom':
			return url;
		default:
			return url; // wat
	}
}
