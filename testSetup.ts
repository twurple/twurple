/* eslint-disable @typescript-eslint/no-require-imports */
import { TwitchAPICallOptions } from 'twitch/lib/TwitchClient';

declare global {
	const setupMocks: (_jest: typeof jest) => void;
	const setMockResponse: (data: string) => void;
	const requireMockResponse: (path: string) => void;
	const twitch: import('twitch').default;

	namespace NodeJS {
		interface Global {
			setupMocks: (_jest: typeof jest) => void;
			setMockResponse: (data: string) => void;
			requireMockResponse: (path: string) => void;
			twitch: import('twitch').default;
		}
	}
}

global.setupMocks = async _jest => {
	const TwitchClient = _jest.requireActual('twitch').default;
	// const origCallAPI = TwitchClient.callAPI;
	if (process.env.LIVE_TEST) {
		global.setMockResponse = () => {
		};
		global.requireMockResponse = () => {
		};
		global.twitch = await TwitchClient.withCredentials(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_AUTH_TOKEN);
	} else {
		let mockResponse: string | undefined;
		global.setMockResponse = (data?: string) => {
			mockResponse = data;
		};
		global.requireMockResponse = (path: string) => {
			mockResponse = require(path);
		};
		const mockTokenInfo = require('./__tests__/core/kraken/mocks/root.json');
		// eslint-disable-next-line prefer-arrow-callback,@typescript-eslint/no-explicit-any
		TwitchClient.callAPI = _jest.fn().mockImplementation(function (options: TwitchAPICallOptions) {
			if (options.type === undefined) {
				if (options.url === '/') {
					return mockTokenInfo;
				}
			}
			return mockResponse;
		});

		_jest.mock('twitch', () => TwitchClient);
		global.twitch = await TwitchClient.withCredentials('mock', 'mock');
	}
};
