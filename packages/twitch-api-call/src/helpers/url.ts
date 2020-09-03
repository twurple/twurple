import { TwitchApiCallType } from '../TwitchApiCallOptions';

/** @private */
export function getTwitchApiUrl(url: string, type: TwitchApiCallType) {
	switch (type) {
		case TwitchApiCallType.Kraken:
		case TwitchApiCallType.Helix:
			const typeName = type === TwitchApiCallType.Kraken ? 'kraken' : 'helix';
			return `https://api.twitch.tv/${typeName}/${url.replace(/^\//, '')}`;
		case TwitchApiCallType.Auth:
			return `https://id.twitch.tv/oauth2/${url.replace(/^\//, '')}`;
		case TwitchApiCallType.Custom:
			return url;
		default:
			return url; // wat
	}
}
