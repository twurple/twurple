import { SignJWT, base64url } from 'jose';
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
export async function createExternalJwt(config: ExternalJwtConfig): Promise<string> {
	const ttl = config.ttl ?? 60;
	const dataToSign = createExternalJwtData(config, ttl);
	const jwt = await new SignJWT(dataToSign)
		.setProtectedHeader({ alg: 'HS256' })
		.sign(base64url.decode(config.secret));

	return jwt;
}
