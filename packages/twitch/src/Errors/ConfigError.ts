import { rtfm } from 'twitch-common';
import { CustomError } from './CustomError';

/**
 * Thrown whenever you try using invalid values in the client configuration.
 */
@rtfm('twitch', 'ConfigError')
export class ConfigError extends CustomError {}
