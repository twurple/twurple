import type { Options as BaseOptions } from 'tmi.js';
import { Client as _BaseClient } from 'tmi.js';
import type { AuthProvider } from 'twitch-auth';
import { getValidTokenFromProvider } from 'twitch-auth';

export interface Options extends Omit<BaseOptions, 'identity'> {
	authProvider: AuthProvider;
}

const BaseClient = _BaseClient as typeof _BaseClient & (new (opts: BaseOptions) => ReturnType<typeof _BaseClient>);

class DecoratedClient extends BaseClient {
	constructor(opts: Options) {
		const { authProvider, ...tmiOpts } = opts;
		super({
			...tmiOpts,
			identity: {
				// need this because we can't get a user name dynamically, but need something to not default to justinfan
				username: 'dummy',
				// @ts-ignore TS2322 typings are not updated yet
				password: async () => {
					const { accessToken } = await getValidTokenFromProvider(authProvider, ['chat:read', 'chat:edit']);
					return accessToken.accessToken;
				}
			}
		});
	}
}

export const Client = DecoratedClient as typeof DecoratedClient & ((opts: Options) => DecoratedClient);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Client = DecoratedClient;
