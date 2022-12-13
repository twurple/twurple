import { DataObject, rawDataSymbol } from '@twurple/common';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import { type HelixExtensionSecretListData } from './HelixExtensionSecretList.external';

export class HelixExtensionSecretList extends DataObject<HelixExtensionSecretListData> {
	get latestSecret(): string | null {
		return (
			this[rawDataSymbol].secrets
				.slice()
				.sort((a, b) => new Date(b.expires_at).getTime() - new Date(a.expires_at).getTime())[0]?.content ?? null
		);
	}

	get currentSecrets(): string[] {
		const now = new Date();
		return this[rawDataSymbol].secrets
			.filter(secret => {
				const start = new Date(secret.active_at);
				const end = new Date(secret.expires_at);

				return start < now && now < end;
			})
			.sort((a, b) => new Date(b.expires_at).getTime() - new Date(a.expires_at).getTime())
			.map(secret => secret.content);
	}

	verifyJwt(token: string): unknown {
		for (const secret of this.currentSecrets) {
			try {
				return verify(token, Buffer.from(secret, 'base64'));
			} catch (e) {
				if (e instanceof JsonWebTokenError && e.message === 'invalid signature') {
					continue;
				}
				throw e;
			}
		}

		throw new Error('Could not find a secret that could verify this token');
	}
}
