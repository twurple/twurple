import { type ExternalJwtConfig } from './jwt';

/** @private */
export function createExternalJwtData(config: ExternalJwtConfig, ttl: number) {
	return {
		...config.additionalData,
		exp: Math.floor(Date.now() / 1000) + ttl,
		user_id: config.ownerId,
		role: 'external'
	};
}
