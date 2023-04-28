import type { AccessTokenMaybeWithUserId, AccessTokenWithUserId, AuthProvider } from '@twurple/auth';
import { extractUserId, type UserIdResolvable } from '@twurple/common';

export class ExtensionAuthProvider implements AuthProvider {
	authorizationType = 'Extension';
	currentScopes = [];

	constructor(public readonly clientId: string) {
		if (!('Twitch' in globalThis)) {
			throw new Error("This is not an extension, or you didn't load the Twitch Extension Helper properly.");
		}
	}

	getCurrentScopesForUser(): string[] {
		return [];
	}

	async getAccessTokenForUser(
		user: UserIdResolvable,
		...scopeSets: Array<string[] | undefined>
	): Promise<AccessTokenWithUserId> {
		if (scopeSets.length && scopeSets.some(set => set?.length)) {
			throw new Error(
				`Scopes ${scopeSets
					.filter((val): val is string[] => Boolean(val))
					.map(scopes => scopes.join('|'))
					.join(', ')} requested but direct extension calls do not support scopes. Please use an EBS instead.`
			);
		}

		return {
			...(await this.getAnyAccessToken()),
			userId: extractUserId(user)
		};
	}

	async getAnyAccessToken(): Promise<AccessTokenMaybeWithUserId> {
		const accessToken = Twitch.ext.viewer.helixToken as string | null;

		if (accessToken == null) {
			throw new Error(`Could not retrieve an access token from the Twitch extension environment. This could mean different things:
			
- You're in a mobile extension or the Extension Developer Rig. This is a known issue that has to be resolved by Twitch.
- You didn't wait for the onAuthorized callback before doing any API calls. Before this callback fires, a token is not available.`);
		}

		return {
			accessToken,
			refreshToken: null,
			expiresIn: null,
			obtainmentTimestamp: Date.now(),
			scope: []
		};
	}

	async refreshAccessTokenForUser(user: UserIdResolvable): Promise<AccessTokenWithUserId> {
		// basically just retry
		return await this.getAccessTokenForUser(user);
	}
}
