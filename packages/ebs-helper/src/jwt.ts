import { sign } from 'jsonwebtoken';
import { createExternalJwtData } from './jwt.external';

/** @private */
export interface BaseExternalJwtConfig {
	/**
	 * A valid extension secret to sign the JWT with.
	 */
	secret: string;

	/**
	 * The user ID of the extension's owner.
	 */
	ownerId: string;

	/**
	 * The time the JWT should be valid for, in seconds.
	 *
	 * Defaults to 1 minute (60 seconds).
	 */
	ttl?: number;
}

/**
 * Configuration to create an external JWT.
 *
 * @inheritDoc
 */
export interface ExternalJwtConfig extends BaseExternalJwtConfig {
	additionalData?: Record<string, unknown>;
}

/**
 * Creates a JWT with the role "external" to use with the various extension APIs.
 *
 * @param config The configuration of the JWT to generate.
 *
 * @expandParams
 */
export function createExternalJwt(config: ExternalJwtConfig): string {
	const ttl = config.ttl ?? 60;
	const dataToSign = createExternalJwtData(config, ttl);

	return sign(dataToSign, Buffer.from(config.secret, 'base64'), { algorithm: 'HS256' });
}
