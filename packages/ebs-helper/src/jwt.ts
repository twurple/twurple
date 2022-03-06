import { sign } from 'jsonwebtoken';

export interface BaseExternalJwtConfig {
	secret: string;
	ownerId: string;
	ttl?: number;
}

export interface ExternalJwtConfig extends BaseExternalJwtConfig {
	additionalData?: Record<string, unknown>;
}

export function createExternalJwt(conf: ExternalJwtConfig): string {
	const ttl = conf.ttl ?? 60;
	const dataToSign = {
		...conf.additionalData,
		exp: Math.floor(Date.now() / 1000) + ttl,
		user_id: conf.ownerId,
		role: 'external'
	};

	return sign(dataToSign, Buffer.from(conf.secret, 'base64'), { algorithm: 'HS256' });
}
