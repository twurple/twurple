import type { TwitchApiCallType } from '../TwitchApiCallOptions';

/** @private */
export function getTwitchApiUrl(url: string, type: TwitchApiCallType): string {
	switch (type) {
		case 'kraken':
		case 'helix':
			const typeName = type === 'kraken' ? 'kraken' : 'helix';
			return `https://api.twitch.tv/${typeName}/${url.replace(/^\//, '')}`;
		case 'auth':
			return `https://id.twitch.tv/oauth2/${url.replace(/^\//, '')}`;
		case 'custom':
			return url;
		default:
			return url; // wat
	}
}
