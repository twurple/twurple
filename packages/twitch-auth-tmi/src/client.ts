import type { Options as BaseOptions } from 'tmi.js';
import { Client as BaseClient } from 'tmi.js';
import type { AuthProvider } from 'twitch-auth';
import { getValidTokenFromProvider, InvalidTokenTypeError } from 'twitch-auth';

/**
 * The tmi.js options, with the auth provider replacing the identity option.
 *
 * @inheritDoc
 */
export interface Options extends Omit<BaseOptions, 'identity'> {
	/**
	 * An authentication provider that supplies tokens to the client.
	 *
	 * For more information, see the {@AuthProvider} documentation.
	 */
	authProvider: AuthProvider;
}

/**
 * An extension of the tmi.js client which extends it with {@AuthProvider} integration.
 */
export class DecoratedClient extends BaseClient {
	/**
	 * Creates a new tmi.js client which utilizes the given {@AuthProvider} instance.
	 *
	 * @param opts The tmi.js options, with the auth provider replacing the identity option.
	 */
	constructor(opts: Options) {
		const { authProvider, ...tmiOpts } = opts;
		super({
			...tmiOpts,
			identity: {
				// need this because we can't get a user name dynamically, but need something to not default to justinfan
				username: 'dummy',
				// @ts-expect-error TS2322 typings are not updated yet
				password: async () => {
					if (authProvider.tokenType === 'app') {
						throw new InvalidTokenTypeError(
							`You can not connect to chat using an AuthProvider that supplies app access tokens.
Please provide an auth provider that provides user access tokens, for example \`RefreshableAuthProvider\`.`
						);
					}
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
