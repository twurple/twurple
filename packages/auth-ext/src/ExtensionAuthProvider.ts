import type { AccessToken, AuthProvider, AuthProviderTokenType } from '@twurple/auth';

export class ExtensionAuthProvider implements AuthProvider {
	authorizationType = 'Extension';
	tokenType: AuthProviderTokenType = 'app';
	currentScopes = [];

	constructor(public readonly clientId: string) {
		if (!('Twitch' in globalThis)) {
			throw new Error("This is not an extension, or you didn't load the Twitch Extension Helper properly.");
		}
	}

	async getAccessToken(scopes?: string[]): Promise<AccessToken> {
		if (scopes?.length) {
			throw new Error(
				`Scope ${scopes.join(
					', '
				)} requested but direct extension calls do not support scopes. Please use an EBS instead.`
			);
		}
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

	async refresh(): Promise<AccessToken> {
		// basically just retry
		return await this.getAccessToken();
	}
}
