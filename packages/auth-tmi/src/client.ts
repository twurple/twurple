import { type AuthProvider, getValidTokenFromProviderForIntent } from '@twurple/auth';
import { Client as BaseClient, type Options as BaseOptions } from 'tmi.js';

/**
 * The tmi.js options, with the auth provider replacing the identity option.
 *
 * @inheritDoc
 */
export interface Options extends Omit<BaseOptions, 'identity'> {
	/**
	 * An authentication provider that supplies tokens to the client.
	 *
	 * For more information, see the {@link AuthProvider} documentation.
	 */
	authProvider: AuthProvider;

	/**
	 * The intents to use with the auth provider. Will always additionally check the "chat" intent last.
	 */
	authIntents?: string[];
}

/**
 * An extension of the tmi.js client which extends it with {@link AuthProvider} integration.
 */
export class DecoratedClient extends BaseClient {
	/**
	 * Creates a new tmi.js client which utilizes the given {@link AuthProvider} instance.
	 *
	 * @param opts The tmi.js options, with the auth provider replacing the identity option.
	 */
	constructor(opts: Options) {
		const { authProvider, authIntents = [], ...tmiOpts } = opts;
		super({
			...tmiOpts,
			identity: {
				// need this because we can't get a username dynamically, but need something to not default to justinfan
				username: 'dummy',
				password: async () => {
					let lastTokenError: Error | undefined = undefined;
					for (const intent of [...authIntents, 'chat']) {
						try {
							const { accessToken } = await getValidTokenFromProviderForIntent(authProvider, intent, [
								'chat:read',
								'chat:edit',
							]);
							return accessToken.accessToken;
						} catch (e) {
							lastTokenError = e as Error;
						}
					}

					throw new Error('Could not find a token for any given intent', { cause: lastTokenError });
				},
			},
		});
	}
}

export const Client = DecoratedClient as typeof DecoratedClient & ((opts: Options) => DecoratedClient);
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Client = DecoratedClient;
