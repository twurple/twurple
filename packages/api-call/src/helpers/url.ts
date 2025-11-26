import { getMockApiPort } from '@twurple/common';
import type { TwitchApiCallType } from '../TwitchApiCallOptions.js';

/** @internal */
export function getTwitchApiUrl(url: string, type: TwitchApiCallType): string {
	const mockServerPort = getMockApiPort();

	switch (type) {
		case 'helix': {
			const unprefixedUrl = url.replace(/^\//, '');
			return mockServerPort
				? unprefixedUrl === 'eventsub/subscriptions'
					? `http://localhost:${mockServerPort}/${unprefixedUrl}`
					: `http://localhost:${mockServerPort}/mock/${unprefixedUrl}`
				: `https://api.twitch.tv/helix/${unprefixedUrl}`;
		}
		case 'auth': {
			const unprefixedUrl = url.replace(/^\//, '');
			return mockServerPort
				? `http://localhost:${mockServerPort}/auth/${unprefixedUrl}`
				: `https://id.twitch.tv/oauth2/${unprefixedUrl}`;
		}
		case 'custom':
			return url;
		default:
			return url; // wat
	}
}
